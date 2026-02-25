import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { upload } from "./upload.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

const OUTPUT_DIR = path.join(__dirname, "..", "uploads", "output");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Serve downloads with proper Content-Disposition for download (not preview)
app.use("/downloads", (req, res, next) => {
  const file = path.join(OUTPUT_DIR, req.path);
  if (fs.existsSync(file)) {
    res.setHeader("Content-Disposition", `attachment; filename="${path.basename(req.path)}"`);
    res.setHeader("Content-Type", "application/pdf");
  }
  next();
}, express.static(OUTPUT_DIR));

const isImage = (type: string) => type.startsWith("image/");
const isPDF   = (type: string) => type === "application/pdf";

// ── A4 page size (in points: 72 points = 1 inch) ────────────────────────────
const A4_WIDTH  = 595;  // 8.27 inches × 72
const A4_HEIGHT = 842;  // 11.69 inches × 72

// Fit image to A4 while maintaining aspect ratio
function fitImageToA4(imgWidth: number, imgHeight: number) {
  const ratio = Math.min(A4_WIDTH / imgWidth, A4_HEIGHT / imgHeight);
  return {
    width: imgWidth * ratio,
    height: imgHeight * ratio,
  };
}

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", service: "File Server 5001" }));

// ── Images → PDF (A4 sized pages) ────────────────────────────────────────────
app.post("/api/img-to-pdf", upload.array("files", 20), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length)
      return res.json({ success: false, message: "No files uploaded" });

    const pdfDoc = await PDFDocument.create();

    for (const file of files) {
      if (isImage(file.mimetype)) {
        // Convert image to JPEG via sharp
        const buffer = await sharp(file.path)
          .rotate()
          .jpeg({ quality: 90 })
          .toBuffer();

        const image = await pdfDoc.embedJpg(buffer);
        
        // Fit image to A4 page, maintaining aspect ratio
        const fitted = fitImageToA4(image.width, image.height);
        
        // Create A4 page
        const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        
        // Center image on page
        const x = (A4_WIDTH - fitted.width) / 2;
        const y = (A4_HEIGHT - fitted.height) / 2;
        
        page.drawImage(image, {
          x,
          y,
          width: fitted.width,
          height: fitted.height,
        });

      } else if (isPDF(file.mimetype)) {
        // For existing PDFs, just copy pages as-is
        const donor = await PDFDocument.load(fs.readFileSync(file.path));
        const pages = await pdfDoc.copyPages(donor, donor.getPageIndices());
        pages.forEach((p) => pdfDoc.addPage(p));
      }

      fs.unlinkSync(file.path); // clean up temp file
    }

    const filename = `converted-${Date.now()}.pdf`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, await pdfDoc.save());

    console.log(`✅ IMG→PDF: ${filename} (${files.length} files, A4 sized)`);
    res.json({ success: true, url: `http://localhost:${PORT}/downloads/${filename}` });

  } catch (err: any) {
    console.error("❌ IMG-PDF ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Merge PDFs ────────────────────────────────────────────────────────────────
app.post("/api/merge-pdf", upload.array("files", 20), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length < 2)
      return res.status(400).json({ success: false, message: "Upload at least 2 PDFs" });

    const merged = await PDFDocument.create();

    for (const file of files) {
      if (!isPDF(file.mimetype)) continue;

      const pdf   = await PDFDocument.load(fs.readFileSync(file.path));
      const pages = await merged.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((p) => merged.addPage(p));

      fs.unlinkSync(file.path);
    }

    const filename = `merged-${Date.now()}.pdf`;
    const filepath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filepath, await merged.save());

    console.log(`✅ MERGE: ${filename} (${files.length} PDFs merged)`);
    res.json({ success: true, url: `http://localhost:${PORT}/downloads/${filename}` });

  } catch (err: any) {
    console.error("❌ MERGE ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => console.log(`📁 File Server running on http://localhost:${PORT}`));