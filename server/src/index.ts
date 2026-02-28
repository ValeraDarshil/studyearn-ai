// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./auth.js";
// import userRoutes from "./user-routes.js";
// import leaderboardRoutes from "./leaderboard-routes.js";
// import Groq from "groq-sdk";
// import multer from "multer";
// import { PDFDocument } from "pdf-lib";
// import sharp from "sharp";
// import PptxGenJS from "pptxgenjs";
// import { connectDB } from "./db.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5003;

// /* ================= CORS ================= */

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://studyearn-ai.vercel.app",
//     ],
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "50mb" }));

// /* ================= GROQ ================= */

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// /* ================= MULTER ================= */

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 25 * 1024 * 1024 },
// });

// /* ================= PDF PARSER ================= */

// async function parsePDF(buffer: Buffer) {
//   const pdfParse: any = await import("pdf-parse");
//   return pdfParse(buffer);
// }

// /* ================= HEALTH ================= */

// app.get("/health", (_, res) => {
//   res.json({ status: "ok", port: PORT });
// });

// /* ================= ROUTES ================= */

// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/leaderboard", leaderboardRoutes);

// /* ================= ASK AI ================= */

// app.post("/api/ai/ask", async (req, res) => {
//   try {
//     const { prompt, image } = req.body;

//     if (!prompt && !image) {
//       return res.status(400).json({
//         success: false,
//         answer: "No question provided",
//       });
//     }

//     let messages: any[];

//     if (image && image.startsWith("data:image")) {
//       messages = [
//         {
//           role: "user",
//           content: [
//             {
//               type: "text",
//               text:
//                 prompt ||
//                 "Solve all questions step by step from this image.",
//             },
//             {
//               type: "image_url",
//               image_url: { url: image },
//             },
//           ],
//         },
//       ];
//     } else {
//       messages = [
//         {
//           role: "system",
//           content:
//             "You are an intelligent academic tutor. Solve step by step.",
//         },
//         {
//           role: "user",
//           content: prompt,
//         },
//       ];
//     }

//     const completion = await groq.chat.completions.create({
//       model: image
//         ? "llama-3.2-90b-vision-preview"
//         : "llama-3.3-70b-versatile",
//       messages,
//       temperature: 0.4,
//       max_tokens: 4096,
//     });

//     const answer =
//       completion.choices?.[0]?.message?.content || "No response";

//     res.json({ success: true, answer });

//   } catch (error: any) {
//     console.error("AI ERROR:", error);
//     res.status(500).json({
//       success: false,
//       answer: error.message,
//     });
//   }
// });

// /* ================= PDF QUESTION SOLVER ================= */

// app.post(
//   "/api/ai/solve-pdf",
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       if (!req.file) {
//         return res.status(400).json({ success: false });
//       }

//       const pdfData = await parsePDF(req.file.buffer);

//       const completion = await groq.chat.completions.create({
//         model: "llama-3.3-70b-versatile",
//         messages: [
//           {
//             role: "user",
//             content:
//               "Solve this question paper step by step:\n\n" +
//               pdfData.text,
//           },
//         ],
//         max_tokens: 4096,
//       });

//       const answer =
//         completion.choices?.[0]?.message?.content || "No response";

//       res.json({ success: true, answer });

//     } catch (error) {
//       console.error("PDF SOLVE ERROR:", error);
//       res.status(500).json({ success: false });
//     }
//   }
// );

// /* ================= PPT GENERATOR ================= */

// app.post("/api/ppt/generate", async (req, res) => {
//   try {
//     const { topic, slides } = req.body;

//     const pptx = new (PptxGenJS as any)();
//     pptx.layout = "LAYOUT_16x9";

//     slides.forEach((slide: any) => {
//       const s = pptx.addSlide();

//       s.addText(slide.title || "Slide", {
//         x: 0.5,
//         y: 0.5,
//         fontSize: 28,
//         bold: true,
//       });

//       const bullets = (slide.content || "")
//         .split("\n")
//         .filter((l: string) => l.trim())
//         .map((l: string) => ({
//           text: l,
//           options: { bullet: true },
//         }));

//       s.addText(bullets, {
//         x: 0.5,
//         y: 1.5,
//         fontSize: 18,
//       });
//     });

//     const buffer = await pptx.write("nodebuffer");

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.presentationml.presentation"
//     );

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${topic}.pptx`
//     );

//     res.send(buffer);

//   } catch (error) {
//     console.error("PPT ERROR:", error);
//     res.status(500).json({ success: false });
//   }
// });

// /* ================= IMAGE → PDF ================= */

// app.post(
//   "/api/img-to-pdf",
//   upload.array("files"),
//   async (req: any, res) => {
//     try {
//       const pdfDoc = await PDFDocument.create();

//       for (const file of req.files) {
//         const img = await sharp(file.buffer).png().toBuffer();
//         const image = await pdfDoc.embedPng(img);

//         const page = pdfDoc.addPage([
//           image.width,
//           image.height,
//         ]);

//         page.drawImage(image, {
//           x: 0,
//           y: 0,
//           width: image.width,
//           height: image.height,
//         });
//       }

//       const pdfBytes = await pdfDoc.save();

//       res.setHeader("Content-Type", "application/pdf");
//       res.send(Buffer.from(pdfBytes));

//     } catch (error) {
//       console.error("IMG→PDF ERROR:", error);
//       res.status(500).json({ success: false });
//     }
//   }
// );

// /* ================= MERGE PDF ================= */

// app.post(
//   "/api/merge-pdf",
//   upload.array("files"),
//   async (req: any, res) => {
//     try {
//       const merged = await PDFDocument.create();

//       for (const file of req.files) {
//         const pdf = await PDFDocument.load(file.buffer);
//         const pages = await merged.copyPages(
//           pdf,
//           pdf.getPageIndices()
//         );
//         pages.forEach((p) => merged.addPage(p));
//       }

//       const pdfBytes = await merged.save();

//       res.setHeader("Content-Type", "application/pdf");
//       res.send(Buffer.from(pdfBytes));

//     } catch (error) {
//       console.error("MERGE PDF ERROR:", error);
//       res.status(500).json({ success: false });
//     }
//   }
// );

// /* ================= START SERVER ================= */

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on ${PORT}`);
//     console.log("✅ AI Ready");
//     console.log("✅ PPT Ready");
//     console.log("✅ PDF Tools Ready");
//   });
// });


// c;aude aii //


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./auth.js";
import userRoutes from "./user-routes.js";
import leaderboardRoutes from "./leaderboard-routes.js";
import Groq from "groq-sdk";
import multer from "multer";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import PptxGenJS from "pptxgenjs";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

/* ================= CORS ================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://studyearn-ai.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

/* ================= GROQ ================= */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ================= MULTER ================= */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

/* ================= PDF PARSER ================= */

async function parsePDF(buffer: Buffer) {
  const pdfParse: any = await import("pdf-parse");
  return pdfParse(buffer);
}

/* ================= HEALTH ================= */

app.get("/health", (_, res) => {
  res.json({ status: "ok", port: PORT });
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

/* ================= ASK AI ================= */

const SYSTEM_PROMPT = `You are StudyEarn AI — an expert academic tutor for Indian students (CBSE, ICSE, State boards, Class 8-12 and college).

Rules:
- Solve questions COMPLETELY, step-by-step, show ALL working.
- If multiple questions, answer EACH ONE separately and fully.
- Math: write every calculation step clearly.
- Science: state formula, substitute, solve, explain.
- Theory: structured explanation with examples.
- Be thorough. Never skip steps.`;

async function callGroqVision(imageUrl: string, prompt: string): Promise<string> {
  const VISION_MODELS = [
    "llama-3.2-11b-vision-preview",
    "llama-3.2-90b-vision-preview",
  ];
  const userPrompt = prompt?.trim()
    ? `${prompt}\n\nLook at the image carefully. Solve ALL questions/problems shown, step-by-step with complete working.`
    : "Look at this image. Find ALL questions or problems and solve each one step-by-step with complete working.";

  for (const model of VISION_MODELS) {
    try {
      console.log(`  Vision trying: ${model}`);
      const completion = await groq.chat.completions.create({
        model,
        messages: [{
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        }],
        temperature: 0.3,
        max_tokens: 4096,
      });
      const answer = completion.choices?.[0]?.message?.content;
      if (answer && answer.length > 30) {
        console.log(`  Vision success: ${model}`);
        return answer;
      }
    } catch (err: any) {
      const msg = err?.error?.message || err?.message || String(err);
      console.log(`  ${model} failed: ${msg.substring(0, 80)}`);
    }
  }
  throw new Error("All vision models failed");
}

async function callGroqText(prompt: string): Promise<string> {
  const TEXT_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-70b-versatile", "mixtral-8x7b-32768"];
  for (const model of TEXT_MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 4096,
      });
      const answer = completion.choices?.[0]?.message?.content;
      if (answer) return answer;
    } catch (err: any) {
      console.log(`  ${model} failed: ${(err?.message||"").substring(0,60)}`);
    }
  }
  throw new Error("All text models failed");
}

app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt, image } = req.body;
    if (!prompt && !image) {
      return res.status(400).json({ success: false, answer: "Please enter a question or upload an image/PDF." });
    }
    console.log(`\nAI ask: image=${!!image} prompt="${(prompt||"").substring(0,60)}"`);

    let answer: string;

    if (image) {
      try {
        const imageUrl = image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`;
        answer = await callGroqVision(imageUrl, prompt || "");
      } catch (visionErr: any) {
        console.log(`  Vision failed, text fallback: ${visionErr.message}`);
        const fallback = prompt?.trim()
          ? `A student uploaded an image with this question: "${prompt}"\n\nSolve this completely, step-by-step with all working shown.`
          : `A student uploaded an image of an exam question. Please provide a comprehensive guide on approaching common exam questions. Show step-by-step methods for math, science, and theory questions.`;
        const textAnswer = await callGroqText(fallback);
        answer = `*Note: Image could not be read directly. Answering based on your description:*\n\n${textAnswer}`;
      }
    } else {
      answer = await callGroqText(prompt);
    }

    res.json({ success: true, answer });
  } catch (error: any) {
    console.error("AI ERROR:", error);
    res.status(500).json({ success: false, answer: "AI is temporarily unavailable. Please try again." });
  }
});

/* ================= PDF QUESTION SOLVER ================= */

app.post("/api/ai/solve-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, answer: "No file uploaded." });

    const userPrompt = (req.body.prompt || "").trim();
    console.log(`\nPDF solve: ${req.file.size} bytes`);

    const pdfData = await parsePDF(req.file.buffer);
    const extracted = pdfData.text?.trim();

    if (!extracted || extracted.length < 20) {
      return res.json({
        success: false,
        answer: "Could not extract text from this PDF. It may be a scanned image PDF. Please screenshot the pages and upload as an image instead.",
      });
    }

    const MAX_CHARS = 12000;
    const text = extracted.length > MAX_CHARS
      ? extracted.substring(0, MAX_CHARS) + "\n\n[Document truncated due to length]"
      : extracted;

    const solvePrompt = userPrompt
      ? `The student says: "${userPrompt}"\n\nPDF content:\n${text}\n\nHelp the student as requested.`
      : `Here is a PDF document/question paper:\n\n${text}\n\nFind ALL questions and solve each one completely with step-by-step working. Number answers to match question numbers.`;

    const answer = await callGroqText(solvePrompt);
    res.json({ success: true, answer });
  } catch (error: any) {
    console.error("PDF SOLVE ERROR:", error);
    res.status(500).json({ success: false, answer: "Failed to process PDF. Please try again." });
  }
});

/* ================= PPT GENERATOR ================= */

app.post("/api/ppt/generate", async (req, res) => {
  try {
    const { topic, slides } = req.body;

    const pptx = new (PptxGenJS as any)();
    pptx.layout = "LAYOUT_16x9";

    slides.forEach((slide: any) => {
      const s = pptx.addSlide();

      s.addText(slide.title || "Slide", {
        x: 0.5,
        y: 0.5,
        fontSize: 28,
        bold: true,
      });

      const bullets = (slide.content || "")
        .split("\n")
        .filter((l: string) => l.trim())
        .map((l: string) => ({
          text: l,
          options: { bullet: true },
        }));

      s.addText(bullets, {
        x: 0.5,
        y: 1.5,
        fontSize: 18,
      });
    });

    const buffer = await pptx.write("nodebuffer");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${topic}.pptx`
    );

    res.send(buffer);

  } catch (error) {
    console.error("PPT ERROR:", error);
    res.status(500).json({ success: false });
  }
});

/* ================= IMAGE → PDF ================= */

app.post(
  "/api/img-to-pdf",
  upload.array("files"),
  async (req: any, res) => {
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of req.files) {
        const img = await sharp(file.buffer).png().toBuffer();
        const image = await pdfDoc.embedPng(img);

        const page = pdfDoc.addPage([
          image.width,
          image.height,
        ]);

        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.send(Buffer.from(pdfBytes));

    } catch (error) {
      console.error("IMG→PDF ERROR:", error);
      res.status(500).json({ success: false });
    }
  }
);

/* ================= MERGE PDF ================= */

app.post(
  "/api/merge-pdf",
  upload.array("files"),
  async (req: any, res) => {
    try {
      const merged = await PDFDocument.create();

      for (const file of req.files) {
        const pdf = await PDFDocument.load(file.buffer);
        const pages = await merged.copyPages(
          pdf,
          pdf.getPageIndices()
        );
        pages.forEach((p) => merged.addPage(p));
      }

      const pdfBytes = await merged.save();

      res.setHeader("Content-Type", "application/pdf");
      res.send(Buffer.from(pdfBytes));

    } catch (error) {
      console.error("MERGE PDF ERROR:", error);
      res.status(500).json({ success: false });
    }
  }
);

/* ================= START SERVER ================= */

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
    console.log("✅ AI Ready");
    console.log("✅ PPT Ready");
    console.log("✅ PDF Tools Ready");
  });
});