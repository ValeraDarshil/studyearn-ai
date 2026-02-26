import { useState } from "react";
import {
  Presentation,
  ExternalLink,
  Sparkles,
  Palette,
  GraduationCap,
  FileText,
  ChevronDown,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { generatePPT, askAIFromServer } from "../utils/api";

export function PPTGenerator() {
  const { addPoints, userId, logActivity } = useApp();
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [style, setStyle] = useState("detailed");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [slideCount, setSlideCount] = useState(0);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    if (!classLevel) {
      setError("Please select a class level");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const prompt = `
Return ONLY valid JSON.
Do not add explanation.
Do not use markdown.

Create 5 slides about "${topic}" for ${classLevel} students.
Style: ${style}

Format:
[
 { "title": "Slide title", "content": "Point1\\nPoint2\\nPoint3" }
]
`;

      const aiResponse = await askAIFromServer(userId, prompt);

      if (!aiResponse.success) {
        setError("AI failed to generate slides.");
        setLoading(false);
        return;
      }

      let slides;

      try {
        const clean = aiResponse.answer
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        slides = JSON.parse(clean);
      } catch (err) {
        console.error("JSON ERROR:", aiResponse.answer);
        setError("AI returned invalid format. Try again.");
        setLoading(false);
        return;
      }

      const response = await generatePPT(topic, slides);

      if (response.success) {
        setDownloadUrl(response.url);
        setSlideCount(slides.length);
        setGenerated(true);
        addPoints(25);
        logActivity("ppt_generated", `PPT: ${topic}`, 25);
      } else {
        setError(response.message || "Generation failed.");
      }

    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setGenerated(false);
    setTopic("");
    setClassLevel("");
    setStyle("detailed");
    setDownloadUrl("");
    setError("");
  };

  const styles = [
    { id: "simple", label: "Simple", desc: "Clean & minimal", icon: "📋" },
    { id: "detailed", label: "Detailed", desc: "Comprehensive", icon: "📊" },
    { id: "creative", label: "Creative", desc: "Visual & engaging", icon: "🎨" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Presentation className="w-6 h-6 text-purple-400" />
          PPT Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          AI creates real presentation slides • Earn 25 pts per PPT
        </p>
      </div>

      {generated ? (
        <div className="glass rounded-2xl p-8 text-center space-y-5 border border-green-500/20">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          <div>
            <h3 className="text-xl font-bold text-white">
              Presentation Ready! 🎉
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              {slideCount} slides generated for "{topic}"
            </p>
          </div>
          <div className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" /> +25 points earned
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={downloadUrl}
              download
              className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" />
              Download Presentation
            </a>
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Generate Another
            </button>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Topic *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setError("");
                }}
                placeholder="e.g. Bitcoin, Photosynthesis, World War 2..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Class Level *
            </label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <select
                value={classLevel}
                onChange={(e) => {
                  setClassLevel(e.target.value);
                  setError("");
                }}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white appearance-none focus:outline-none focus:border-purple-500/40 text-sm cursor-pointer"
              >
                <option value="">Select class level</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-3 block flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" /> Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    style === s.id
                      ? "bg-purple-500/10 border-purple-500/40 ring-1 ring-purple-500/20"
                      : "bg-white/[0.02] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-sm font-semibold text-white">
                    {s.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI is creating your slides...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Presentation
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}