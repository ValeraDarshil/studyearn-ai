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
import { generatePPT } from "../utils/api";
import { askAIFromServer } from "../utils/api";

export function PPTGenerator() {
  const { addPoints, logActivity } = useApp();
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
      // 🔥 STEP 1: Generate slide content using your AI route
      const aiResponse = await askAIFromServer(
        "ppt",
        `Create 5 presentation slides about "${topic}" for ${classLevel}.
Return JSON format:
[
 { "title": "Slide title", "content": "Point1\nPoint2\nPoint3" }
]`
      );

      if (!aiResponse.success) {
        setError("AI failed to generate slides.");
        setLoading(false);
        return;
      }

      let slides;

      try {
        slides = JSON.parse(aiResponse.answer);
      } catch {
        setError("AI returned invalid format. Try again.");
        setLoading(false);
        return;
      }

      // 🔥 STEP 2: Send slides to backend PPT generator
      const response = await generatePPT(topic, slides);

      if (response.success) {
        setDownloadUrl(response.url);
        setSlideCount(slides.length);
        setGenerated(true);
        addPoints(25);
        logActivity("ppt_generated", `PPT: ${topic}`, 25);
      } else {
        setError(response.message || "PPT generation failed.");
      }

    } catch (err: any) {
      console.error("PPT ERROR:", err);
      setError(err.message || "Something went wrong.");
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Presentation className="w-6 h-6 text-purple-400" />
        PPT Generator
      </h1>

      {generated ? (
        <div className="glass rounded-2xl p-8 text-center space-y-5 border border-green-500/20">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">
            Presentation Ready 🎉
          </h3>
          <p className="text-sm text-slate-400">
            {slideCount} slides generated
          </p>

          <a
            href={downloadUrl}
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white"
          >
            <ExternalLink className="w-4 h-4" />
            Download PPT
          </a>

          <button
            onClick={reset}
            className="block mx-auto mt-4 text-sm text-slate-400"
          >
            Generate Another
          </button>
        </div>
      ) : (
        <div className="glass rounded-2xl p-6 space-y-4">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <select
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            className="w-full p-3 rounded bg-slate-800 text-white"
          >
            <option value="">Select level</option>
            <option value="8">Class 8</option>
            <option value="9">Class 9</option>
            <option value="10">Class 10</option>
            <option value="Undergraduate">Undergraduate</option>
          </select>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded"
          >
            {loading ? "Generating..." : "Generate PPT"}
          </button>
        </div>
      )}
    </div>
  );
}