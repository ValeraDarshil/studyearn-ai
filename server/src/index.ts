// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import axios from "axios";

// // ------ for PDF tool ------ //
// import { upload } from "./upload";
// import fs from "fs";
// import path from "path";
// import { PDFDocument } from "pdf-lib";
// import sharp from "sharp";

// // ------ for merge pdfs --------- //
// import { upload } from "./upload";
// import { mergePDFs } from "./pdf/mergePdf";
// import path from "path";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "20mb" }));

// const PORT = process.env.PORT || 5000;
// const KEY = process.env.OPENROUTER_API_KEY;

// if (!KEY) throw new Error("OPENROUTER_API_KEY missing");


// // -------- HEADERS (ONLY ONCE) --------
// const headers = {
//   Authorization: `Bearer ${KEY}`,
//   "Content-Type": "application/json",
//   "HTTP-Referer": "http://localhost:5173",
//   "X-Title": "AI Education Platform",
// };



// // ---------------- TEXT AI ----------------
// async function textAI(prompt: string) {
//   const r = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "openai/gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     },
//     { headers }
//   );

//   return r.data?.choices?.[0]?.message?.content;
// }



// // ---------------- IMAGE AI (VISION) ----------------
// async function imageAI(prompt: string, image: string) {
//   const r = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "google/gemma-3-12b-it:free",
//       messages: [
//         {
//           role: "user",
//           content: [
//             { type: "text", text: prompt || "Solve this step by step" },
//             {
//               type: "image_url",
//               image_url: {
//                 url: image, // FULL base64 DATA URL yahi rahega
//               },
//             },
//           ],
//         },
//       ],
//       max_tokens: 700,
//     },
//     { headers }
//   );

//   return r.data?.choices?.[0]?.message?.content;
// }

// // ---------------- ROUTE ----------------
// app.post("/api/ai", async (req, res) => {
//   try {
//     const { prompt, image } = req.body;

//     let answer = "";

//     if (image) {
//       answer = await imageAI(prompt, image);
//     } else {
//       answer = await textAI(prompt);
//     }

//     if (!answer) throw new Error("Empty AI response");

//     res.json({
//       success: true,
//       answer,
//     });
//   } catch (err: any) {
//     console.error("AI ERROR →", err.response?.data || err.message);

//     res.json({
//       success: false,
//       answer:
//         err.response?.data?.error?.message ||
//         err.message ||
//         "AI failed to respond",
//     });
//   }
// });



// app.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );

// const OUTPUT_DIR = path.join(__dirname, "..", "uploads", "output");
// fs.mkdirSync(OUTPUT_DIR, { recursive: true });
// app.use("/downloads", express.static(OUTPUT_DIR));

// // ================= IMAGE TO PDF =================
// app.post("/api/img-to-pdf", upload.array("files", 20), async (req, res) => {
//   try {
//     const files = req.files as Express.Multer.File[];

//     if (!files || files.length === 0)
//       return res.json({ success: false, message: "No images uploaded" });

//     const pdfDoc = await PDFDocument.create();

//     for (const file of files) {
//       // compress + convert to jpeg buffer (important for compatibility)
//       const imgBuffer = await sharp(file.path)
//         .rotate()
//         .jpeg({ quality: 90 })
//         .toBuffer();

//       const img = await pdfDoc.embedJpg(imgBuffer);
//       const page = pdfDoc.addPage([img.width, img.height]);

//       page.drawImage(img, {
//         x: 0,
//         y: 0,
//         width: img.width,
//         height: img.height,
//       });

//       fs.unlinkSync(file.path); // cleanup temp file
//     }

//     const pdfBytes = await pdfDoc.save();
//     const filename = `converted-${Date.now()}.pdf`;
//     const outputPath = path.join(OUTPUT_DIR, filename);

//     fs.writeFileSync(outputPath, pdfBytes);

//     res.json({
//       success: true,
//       url: `http://localhost:${PORT}/downloads/${filename}`,
//     });
//   } catch (err) {
//     console.error(err);
//     res.json({ success: false, message: "Conversion failed" });
//   }
// });

// // PDF MERGE ROUTE
// app.post("/api/merge-pdf", upload.array("files", 10), async (req, res) => {
//   try {
//     const files = req.files as Express.Multer.File[];

//     if (!files || files.length < 2) {
//       return res.status(400).json({ error: "Upload at least 2 PDFs" });
//     }

//     const result = await mergePDFs(files);

//     res.json({
//       success: true,
//       url: result.url,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// });



// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import axios from "axios";

// // ---- FILE TOOLS ----
// import { upload } from "./upload";
// import fs from "fs";
// import path from "path";
// import { PDFDocument } from "pdf-lib";
// import sharp from "sharp";
// import { mergePDFs } from "./pdf/mergePdf";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "20mb" }));

// const PORT = process.env.PORT || 5000;
// const KEY = process.env.OPENROUTER_API_KEY;

// if (!KEY) throw new Error("OPENROUTER_API_KEY missing");


// // ================= OPENROUTER =================
// const headers = {
//   Authorization: `Bearer ${KEY}`,
//   "Content-Type": "application/json",
//   "HTTP-Referer": "http://localhost:5173",
//   "X-Title": "AI Education Platform",
// };

// // ---------- TEXT ----------
// async function textAI(prompt: string) {
//   const r = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "openai/gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     },
//     { headers }
//   );

//   return r.data?.choices?.[0]?.message?.content;
// }

// // ---------- IMAGE ----------
// async function imageAI(prompt: string, image: string) {
//   const r = await axios.post(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       model: "google/gemma-3-12b-it:free",
//       messages: [
//         {
//           role: "user",
//           content: [
//             { type: "text", text: prompt || "Solve step by step" },
//             { type: "image_url", image_url: { url: image } },
//           ],
//         },
//       ],
//       max_tokens: 700,
//     },
//     { headers }
//   );

//   return r.data?.choices?.[0]?.message?.content;
// }

// // ---------- AI ROUTE ----------
// app.post("/api/ai", async (req, res) => {
//   try {
//     const { prompt, image } = req.body;

//     const answer = image
//       ? await imageAI(prompt, image)
//       : await textAI(prompt);

//     if (!answer) throw new Error("Empty AI response");

//     res.json({ success: true, answer });
//   } catch (err: any) {
//     console.error("AI ERROR →", err.response?.data || err.message);

//     res.json({
//       success: false,
//       answer:
//         err.response?.data?.error?.message ||
//         err.message ||
//         "AI failed to respond",
//     });
//   }
// });


// // ================= FILE STORAGE =================
// const OUTPUT_DIR = path.join(__dirname, "..", "uploads", "output");
// fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// app.use("/downloads", express.static(OUTPUT_DIR));


// // ================= IMAGE → PDF =================
// app.post("/api/img-to-pdf", upload.array("files", 20), async (req, res) => {
//   try {
//     const files = req.files as Express.Multer.File[];

//     if (!files?.length)
//       return res.json({ success: false, message: "No images uploaded" });

//     const pdfDoc = await PDFDocument.create();

//     for (const file of files) {
//       const imgBuffer = await sharp(file.path)
//         .rotate()
//         .jpeg({ quality: 90 })
//         .toBuffer();

//       const img = await pdfDoc.embedJpg(imgBuffer);
//       const page = pdfDoc.addPage([img.width, img.height]);

//       page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

//       fs.unlinkSync(file.path);
//     }

//     const pdfBytes = await pdfDoc.save();
//     const filename = `converted-${Date.now()}.pdf`;
//     const outputPath = path.join(OUTPUT_DIR, filename);

//     fs.writeFileSync(outputPath, pdfBytes);

//     res.json({
//       success: true,
//       url: `http://localhost:${PORT}/downloads/${filename}`,
//     });
//   } catch (err) {
//     console.error(err);
//     res.json({ success: false, message: "Conversion failed" });
//   }
// });


// // ================= MERGE PDF =================
// app.post("/api/merge-pdf", upload.array("files", 10), async (req, res) => {
//   try {
//     const files = req.files as Express.Multer.File[];

//     if (!files || files.length < 2)
//       return res.status(400).json({ error: "Upload at least 2 PDFs" });

//     const mergedPdf = await PDFDocument.create();

//     for (const file of files) {
//       const pdfBytes = fs.readFileSync(file.path);
//       const pdf = await PDFDocument.load(pdfBytes);

//       const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
//       pages.forEach((p) => mergedPdf.addPage(p));

//       fs.unlinkSync(file.path); // cleanup temp files
//     }

//     const mergedBytes = await mergedPdf.save();
//     const filename = `merged-${Date.now()}.pdf`;
//     const outputPath = path.join(OUTPUT_DIR, filename);

//     fs.writeFileSync(outputPath, mergedBytes);

//     res.json({
//       success: true,
//       url: `http://localhost:${PORT}/downloads/${filename}`,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false });
//   }
// });


// // ================= START SERVER =================
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on http://localhost:${PORT}`)
// );





// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { upload } from "./upload";
// import fs from "fs";
// import path from "path";
// import { PDFDocument } from "pdf-lib";
// import sharp from "sharp";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "20mb" }));

// const PORT = process.env.PORT || 5000;

// // ================= STORAGE =================
// const OUTPUT_DIR = path.join(__dirname, "..", "uploads", "output");
// fs.mkdirSync(OUTPUT_DIR, { recursive: true });
// app.use("/downloads", express.static(OUTPUT_DIR));

// // ================= HELPERS =================
// const isImage = (mimetype: string) => mimetype.startsWith("image/");
// const isPDF = (mimetype: string) => mimetype === "application/pdf";

// // ================= IMAGE/PDF → PDF =================
// app.post("/api/img-to-pdf", upload.array("files", 20), async (req, res) => {
//   try {
//     const files = req.files as Express.Multer.File[];
//     if (!files?.length)
//       return res.json({ success: false, message: "No files uploaded" });

//     const pdfDoc = await PDFDocument.create();

//     for (const file of files) {
//       console.log("Processing:", file.originalname, file.mimetype);

//       // IMAGE
//       if (isImage(file.mimetype)) {
//         const imgBuffer = await sharp(file.path)
//           .rotate()
//           .flatten({ background: "#ffffff" }) // fix transparent png crash
//           .jpeg({ quality: 90 })
//           .toBuffer();

//         const img = await pdfDoc.embedJpg(imgBuffer);
//         const page = pdfDoc.addPage([img.width, img.height]);

//         page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
//       }

//       // PDF
//       else if (isPDF(file.mimetype)) {
//         const donorPdf = await PDFDocument.load(fs.readFileSync(file.path));
//         const pages = await pdfDoc.copyPages(donorPdf, donorPdf.getPageIndices());
//         pages.forEach(p => pdfDoc.addPage(p));
//       }

//       else {
//         fs.unlinkSync(file.path);
//         return res.status(400).json({ success: false, message: `Unsupported file: ${file.originalname}` });
//       }

//       fs.unlinkSync(file.path);
//     }

//     const filename = `converted-${Date.now()}.pdf`;
//     fs.writeFileSync(path.join(OUTPUT_DIR, filename), await pdfDoc.save());

//     res.json({ success: true, url: `http://localhost:${PORT}/downloads/${filename}` });

//   } catch (err) {
//     console.error("IMG→PDF ERROR:", err);
//     res.status(500).json({ success: false, message: "Conversion failed" });
//   }
// });

// // ================= MERGE PDF =================
// app.post("/api/merge-pdf", upload.array("files", 20), async (req, res) => {
//   try {
//     const files = req.files as Express.Multer.File[];
//     if (!files || files.length < 2)
//       return res.status(400).json({ success: false, message: "Upload at least 2 PDFs" });

//     const mergedPdf = await PDFDocument.create();

//     for (const file of files) {
//       if (!isPDF(file.mimetype)) {
//         fs.unlinkSync(file.path);
//         return res.status(400).json({ success: false, message: `${file.originalname} is not a PDF` });
//       }

//       const pdf = await PDFDocument.load(fs.readFileSync(file.path));
//       const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
//       pages.forEach(p => mergedPdf.addPage(p));
//       fs.unlinkSync(file.path);
//     }

//     const filename = `merged-${Date.now()}.pdf`;
//     fs.writeFileSync(path.join(OUTPUT_DIR, filename), await mergedPdf.save());

//     res.json({ success: true, url: `http://localhost:${PORT}/downloads/${filename}` });

//   } catch (err) {
//     console.error("MERGE ERROR:", err);
//     res.status(500).json({ success: false, message: "Merge failed" });
//   }
// });

// app.listen(PORT, () => console.log(`🚀 Server running http://localhost:${PORT}`));




// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { upload } from "./upload";
// import fs from "fs";
// import path from "path";
// import { PDFDocument } from "pdf-lib";
// import sharp from "sharp";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "20mb" }));

// const PORT = process.env.PORT || 5000;

// // ================= STORAGE =================
// const OUTPUT_DIR = path.join(__dirname, "..", "uploads", "output");
// fs.mkdirSync(OUTPUT_DIR, { recursive: true });
// app.use("/downloads", express.static(OUTPUT_DIR));

// // ================= HELPERS =================
// const isImage = (mimetype: string) => mimetype.startsWith("image/");
// const isPDF = (mimetype: string) => mimetype === "application/pdf";

// // ================= AI ROUTE =================
// app.post("/api/ai", async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     if (!prompt) {
//       return res.json({
//         success: false,
//         answer: "No prompt provided",
//       });
//     }

//     // TEMP DEMO RESPONSE (Replace with real AI later)
//     const fakeAnswer = `Here is a detailed explanation for:\n\n${prompt}\n\n(This is a demo AI response. You can connect OpenAI later.)`;

//     res.json({
//       success: true,
//       answer: fakeAnswer,
//     });

//   } catch (error) {
//     console.error("AI ERROR:", error);
//     res.status(500).json({
//       success: false,
//       answer: "AI failed",
//     });
//   }
// });

// // ================= IMAGE/PDF → PDF =================
// app.post("/api/img-to-pdf", upload.array("files", 20), async (req, res) => {
//   try {
//     const files = req.files as Express.Multer.File[];
//     if (!files?.length)
//       return res.json({ success: false, message: "No files uploaded" });

//     const pdfDoc = await PDFDocument.create();

//     for (const file of files) {
//       if (isImage(file.mimetype)) {
//         const imgBuffer = await sharp(file.path)
//           .rotate()
//           .flatten({ background: "#ffffff" })
//           .jpeg({ quality: 90 })
//           .toBuffer();

//         const img = await pdfDoc.embedJpg(imgBuffer);
//         const page = pdfDoc.addPage([img.width, img.height]);

//         page.drawImage(img, {
//           x: 0,
//           y: 0,
//           width: img.width,
//           height: img.height,
//         });
//       } else if (isPDF(file.mimetype)) {
//         const donorPdf = await PDFDocument.load(
//           fs.readFileSync(file.path)
//         );
//         const pages = await pdfDoc.copyPages(
//           donorPdf,
//           donorPdf.getPageIndices()
//         );
//         pages.forEach((p) => pdfDoc.addPage(p));
//       } else {
//         fs.unlinkSync(file.path);
//         return res.status(400).json({
//           success: false,
//           message: `Unsupported file: ${file.originalname}`,
//         });
//       }

//       fs.unlinkSync(file.path);
//     }

//     const filename = `converted-${Date.now()}.pdf`;
//     fs.writeFileSync(
//       path.join(OUTPUT_DIR, filename),
//       await pdfDoc.save()
//     );

//     res.json({
//       success: true,
//       url: `http://localhost:${PORT}/downloads/${filename}`,
//     });

//   } catch (err) {
//     console.error("IMG→PDF ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Conversion failed",
//     });
//   }
// });

// // ================= MERGE PDF =================
// app.post("/api/merge-pdf", upload.array("files", 20), async (req, res) => {
//   try {
//     const files = req.files as Express.Multer.File[];

//     if (!files || files.length < 2)
//       return res.status(400).json({
//         success: false,
//         message: "Upload at least 2 PDFs",
//       });

//     const mergedPdf = await PDFDocument.create();

//     for (const file of files) {
//       if (!isPDF(file.mimetype)) {
//         fs.unlinkSync(file.path);
//         return res.status(400).json({
//           success: false,
//           message: `${file.originalname} is not a PDF`,
//         });
//       }

//       const pdf = await PDFDocument.load(
//         fs.readFileSync(file.path)
//       );
//       const pages = await mergedPdf.copyPages(
//         pdf,
//         pdf.getPageIndices()
//       );
//       pages.forEach((p) => mergedPdf.addPage(p));

//       fs.unlinkSync(file.path);
//     }

//     const filename = `merged-${Date.now()}.pdf`;
//     fs.writeFileSync(
//       path.join(OUTPUT_DIR, filename),
//       await mergedPdf.save()
//     );

//     res.json({
//       success: true,
//       url: `http://localhost:${PORT}/downloads/${filename}`,
//     });

//   } catch (err) {
//     console.error("MERGE ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Merge failed",
//     });
//   }
// });

// app.listen(PORT, () =>
//   console.log(`🚀 Server running http://localhost:${PORT}`)
// );
