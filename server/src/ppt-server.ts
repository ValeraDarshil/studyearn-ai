import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_KEY = process.env.GROQ_API_KEY!;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY!;

// ── Generate real PPT content via Groq ────────────────────────────────────
const generateSlides = async (topic: string, classLevel: string, style: string) => {
  const styleDesc = {
    simple:   "simple and clear, 3-4 bullet points per slide, easy language",
    detailed: "detailed and comprehensive, 4-5 bullet points per slide, thorough explanations",
    creative: "creative and engaging, fun facts, real-world examples, 3-4 points per slide",
  }[style] || "detailed";

  const prompt = `Create a presentation about "${topic}" for Class ${classLevel} students.
Style: ${styleDesc}

Return ONLY a valid JSON object, no explanation, no markdown, no code blocks. Just raw JSON:
{
  "slides": [
    {"title": "slide title", "points": ["point 1", "point 2", "point 3"]},
    {"title": "slide title", "points": ["point 1", "point 2", "point 3"]}
  ]
}

Rules:
- Exactly 7 slides
- Slide 1: Title slide about "${topic}"
- Slide 2: Introduction / What is ${topic}?
- Slides 3-5: Core concepts, key facts, examples
- Slide 6: Real-world applications
- Slide 7: Summary & key takeaways
- Each point max 12 words
- All content must be factually accurate about "${topic}"
- Do NOT use generic placeholder text like "Key learning objectives"`;

  // Try Groq first
  const groqModels = ["llama-3.3-70b-versatile", "gemma2-9b-it", "mixtral-8x7b-32768"];
  for (const model of groqModels) {
    try {
      console.log(`🧠 PPT: Groq ${model}`);
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model,
          messages: [
            { role: "system", content: "You are a presentation creator. Return ONLY valid JSON, nothing else." },
            { role: "user", content: prompt }
          ],
          max_tokens: 1500,
          temperature: 0.5,
        },
        { headers: { Authorization: `Bearer ${GROQ_KEY}`, "Content-Type": "application/json" }, timeout: 30000 }
      );
      const text = res.data.choices[0].message.content.trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.slides?.length > 0) {
          console.log(`✅ PPT content generated: ${parsed.slides.length} slides`);
          return parsed;
        }
      }
    } catch (err: any) {
      console.log(`❌ Groq ${model}: ${err.response?.status}`);
    }
  }

  // Fallback: OpenRouter
  const orModels = ["google/gemma-3-27b-it:free", "meta-llama/llama-3.3-70b-instruct:free"];
  for (const model of orModels) {
    try {
      console.log(`🔄 PPT: OpenRouter ${model}`);
      const res = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages: [
            { role: "system", content: "Return ONLY valid JSON, nothing else." },
            { role: "user", content: prompt }
          ],
          max_tokens: 1500,
        },
        { headers: { Authorization: `Bearer ${OPENROUTER_KEY}`, "Content-Type": "application/json", "HTTP-Referer": "http://localhost:5173" }, timeout: 35000 }
      );
      const text = res.data.choices[0].message.content.trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.slides?.length > 0) return parsed;
      }
    } catch (err: any) {
      console.log(`❌ OR ${model}: ${err.response?.status}`);
    }
  }

  throw new Error("Could not generate slides");
};

// ── Build HTML presentation ────────────────────────────────────────────────
const buildHTML = (slides: any[], topic: string, style: string): string => {
  const themes: Record<string, any> = {
    simple: {
      bg: "#667eea",
      bg2: "#764ba2",
      accent: "#667eea",
      card: "#ffffff",
      text: "#1a202c",
    },
    detailed: {
      bg: "#1e3c72",
      bg2: "#2a5298",
      accent: "#2a5298",
      card: "#ffffff",
      text: "#1a202c",
    },
    creative: {
      bg: "#f093fb",
      bg2: "#f5576c",
      accent: "#f5576c",
      card: "#ffffff",
      text: "#1a202c",
    },
  };
  const t = themes[style] || themes.detailed;

  const slidesHTML = slides.map((slide, idx) => `
    <div class="slide ${idx === 0 ? 'active' : ''}">
      <div class="slide-inner">
        <div class="slide-num">${idx + 1} / ${slides.length}</div>
        <h1>${slide.title}</h1>
        <ul>
          ${(slide.points || []).map((p: string) => `<li>${p}</li>`).join("\n          ")}
        </ul>
        <div class="slide-topic">${topic}</div>
      </div>
    </div>`).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic} - Presentation</title>
<style>
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: linear-gradient(135deg, ${t.bg} 0%, ${t.bg2} 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 20px 80px;
  }

  .slide { display: none; width: 100%; max-width: 1000px; }
  .slide.active { display: block; animation: fadeIn 0.4s ease; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .slide-inner {
    background: ${t.card};
    border-radius: 24px;
    padding: 56px 64px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.25);
    min-height: 480px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  .slide-num {
    position: absolute;
    top: 24px; right: 32px;
    font-size: 13px;
    color: #94a3b8;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .slide-topic {
    position: absolute;
    bottom: 24px; left: 32px;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  h1 {
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 800;
    color: ${t.text};
    margin-bottom: 36px;
    line-height: 1.2;
    padding-bottom: 20px;
    border-bottom: 4px solid ${t.accent};
  }

  ul { list-style: none; }

  li {
    font-size: clamp(16px, 2vw, 22px);
    color: ${t.text};
    padding: 10px 0 10px 36px;
    position: relative;
    line-height: 1.5;
    border-bottom: 1px solid rgba(0,0,0,0.06);
  }
  li:last-child { border-bottom: none; }

  li::before {
    content: '';
    position: absolute;
    left: 0; top: 50%;
    transform: translateY(-50%);
    width: 10px; height: 10px;
    border-radius: 50%;
    background: ${t.accent};
  }

  /* Controls */
  .controls {
    position: fixed;
    bottom: 24px; left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    align-items: center;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(12px);
    padding: 10px 20px;
    border-radius: 50px;
    border: 1px solid rgba(255,255,255,0.15);
  }

  .controls button {
    padding: 8px 22px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    border-radius: 30px;
    background: rgba(255,255,255,0.15);
    color: white;
    cursor: pointer;
    transition: all 0.2s;
  }
  .controls button:hover:not(:disabled) {
    background: rgba(255,255,255,0.3);
    transform: scale(1.05);
  }
  .controls button:disabled { opacity: 0.3; cursor: not-allowed; }

  .controls .counter {
    color: rgba(255,255,255,0.8);
    font-size: 13px;
    font-weight: 600;
    min-width: 60px;
    text-align: center;
  }

  @media (max-width: 600px) {
    .slide-inner { padding: 36px 28px; min-height: 360px; }
    h1 { font-size: 26px; }
    li { font-size: 15px; }
  }
</style>
</head>
<body>

${slidesHTML}

<div class="controls">
  <button id="prev" onclick="go(-1)">&#8592; Prev</button>
  <span class="counter" id="counter">1 / ${slides.length}</span>
  <button id="next" onclick="go(1)">Next &#8594;</button>
</div>

<script>
  let cur = 0;
  const slides = document.querySelectorAll('.slide');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const counter = document.getElementById('counter');

  function go(dir) {
    slides[cur].classList.remove('active');
    cur = Math.max(0, Math.min(cur + dir, slides.length - 1));
    slides[cur].classList.add('active');
    counter.textContent = (cur + 1) + ' / ' + slides.length;
    prev.disabled = cur === 0;
    next.disabled = cur === slides.length - 1;
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
  });

  prev.disabled = true;
</script>
</body>
</html>`;
};

// ── API ────────────────────────────────────────────────────────────────────
app.post("/api/generate-ppt", async (req, res) => {
  const { topic, classLevel, style, userId } = req.body;
  if (!topic || !classLevel || !style) {
    return res.json({ success: false, message: "Topic, class level and style required" });
  }

  console.log(`\n📊 PPT: "${topic}" | Class ${classLevel} | ${style}`);

  try {
    const data = await generateSlides(topic, classLevel, style);
    const html = buildHTML(data.slides, topic, style);

    const filename = `ppt-${Date.now()}.html`;
    const outDir = path.join(__dirname, "../uploads/output");
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, filename), html, "utf8");

    console.log(`✅ PPT saved: ${filename}`);
    res.json({
      success: true,
      // Return URL to view it in browser, not download
      viewUrl: `http://localhost:5002/view/${filename}`,
      slides: data.slides.length,
    });
  } catch (err: any) {
    console.log("❌ PPT Error:", err.message);
    res.json({ success: false, message: "Failed to generate. Please try again." });
  }
});

// Serve HTML directly in browser (not as download)
app.get("/view/:filename", (req, res) => {
  const fp = path.join(__dirname, "../uploads/output", req.params.filename);
  if (fs.existsSync(fp)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(fs.readFileSync(fp, "utf8"));
  } else {
    res.status(404).send("Not found");
  }
});

app.get("/health", (req, res) => res.json({ status: "ok", service: "PPT Server 5002" }));

app.listen(5002, () => {
  console.log("📊 PPT Server → http://localhost:5002");
  console.log("  Groq:", GROQ_KEY ? "✅" : "❌ missing");
});