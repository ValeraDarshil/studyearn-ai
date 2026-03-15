/**
 * StudyEarn AI — Certificate Page
 * Custom name, download as PNG, share text
 */
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share2, ArrowLeft, Edit2, Check } from 'lucide-react';
import { COURSE_REGISTRY } from '../../data/courses/index.js';
import { useCodeLearn } from '../../hooks/useCodeLearn.js';

// ── Canvas Certificate Renderer ────────────────────────────────
function drawCertificate(canvas, certData, courseInfo, displayName) {
  if (!canvas || !certData) return;
  const ctx = canvas.getContext('2d');
  const W = 900, H = 640;
  canvas.width = W;
  canvas.height = H;

  // Background
  ctx.fillStyle = '#08081a';
  ctx.fillRect(0, 0, W, H);

  // Outer golden border
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, W - 32, H - 32);

  // Inner border
  ctx.strokeStyle = 'rgba(201,162,39,0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(28, 28, W - 56, H - 56);

  // Corner diamonds
  const diamond = (x, y) => {
    ctx.fillStyle = '#c9a227';
    ctx.beginPath();
    ctx.moveTo(x, y - 10); ctx.lineTo(x + 10, y);
    ctx.lineTo(x, y + 10); ctx.lineTo(x - 10, y);
    ctx.closePath(); ctx.fill();
  };
  diamond(16, 16); diamond(W - 16, 16);
  diamond(16, H - 16); diamond(W - 16, H - 16);

  // Gradient top/bottom lines
  const grad = ctx.createLinearGradient(60, 0, W - 60, 0);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.5, '#c9a227');
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60, 80); ctx.lineTo(W - 60, 80); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(60, H - 80); ctx.lineTo(W - 60, H - 80); ctx.stroke();

  // StudyEarn AI
  ctx.fillStyle = '#c9a227';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('STUDYEARN AI', W / 2, 65);

  // Certificate of Completion
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px serif';
  ctx.fillText('Certificate of Completion', W / 2, 160);

  // Subtitle
  ctx.fillStyle = 'rgba(201,162,39,0.8)';
  ctx.font = 'italic 18px serif';
  ctx.fillText('This is to certify that', W / 2, 210);

  // Student Name
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 52px serif`;
  ctx.fillText(displayName, W / 2, 290);

  // Underline
  const nameWidth = ctx.measureText(displayName).width;
  ctx.strokeStyle = '#c9a227';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - nameWidth / 2, 300);
  ctx.lineTo(W / 2 + nameWidth / 2, 300);
  ctx.stroke();

  // Has successfully completed
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '18px serif';
  ctx.fillText('has successfully completed the', W / 2, 340);

  // Course name
  ctx.fillStyle = courseInfo?.textClass?.includes('yellow') ? '#fbbf24'
                : courseInfo?.textClass?.includes('blue')   ? '#60a5fa'
                : courseInfo?.textClass?.includes('purple') ? '#c084fc'
                : '#a78bfa';
  ctx.font = 'bold 28px serif';
  ctx.fillText(certData.languageDisplayName, W / 2, 380);

  // Duration
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '15px sans-serif';
  ctx.fillText('12 Weeks · 48 Sections · Full Course', W / 2, 415);

  // XP
  ctx.fillStyle = '#c9a227';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`Total XP Earned: ${certData.totalXP}`, W / 2, 455);

  // Date
  const date = new Date(certData.issuedAt);
  const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '14px sans-serif';
  ctx.fillText(`Issued: ${dateStr}`, W / 2, 490);

  // Signature line
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(W/2 - 100, 560); ctx.lineTo(W/2 + 100, 560); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '13px sans-serif';
  ctx.fillText('StudyEarn AI Team', W / 2, 578);

  // Certificate ID
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '11px monospace';
  ctx.fillText(`Certificate ID: ${certData.certificateId}`, W / 2, 617);

  // Language emoji
  ctx.font = '50px sans-serif';
  ctx.fillText(courseInfo?.emoji || '🎓', W / 2, 118);
}

// ── Certificate Page ───────────────────────────────────────────
export default function CertificatePage() {
  const { language } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressInfo, setProgressInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  // Custom name state
  const [customName, setCustomName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const courseInfo = COURSE_REGISTRY.find(c => c.id === language);
  const { getCertificate } = useCodeLearn(language);

  const displayName = customName || certData?.userName || 'Student';

  useEffect(() => {
    getCertificate().then(result => {
      if (result.success) {
        setCertData(result.certificate);
        setCustomName(result.certificate.userName || '');
        setNameInput(result.certificate.userName || '');
      } else {
        setError(result.message);
        if (result.progress) setProgressInfo(result.progress);
      }
      setLoading(false);
    });
  }, [language]);

  // Redraw canvas when name or certData changes
  useEffect(() => {
    if (certData && canvasRef.current) {
      drawCertificate(canvasRef.current, certData, courseInfo, displayName);
    }
  }, [certData, courseInfo, displayName]);

  const handleSaveName = () => {
    if (nameInput.trim()) setCustomName(nameInput.trim());
    setEditingName(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    const safeName = displayName.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
    link.download = `StudyEarn_${language}_Certificate_${safeName}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleShare = async () => {
    const text = `🎓 I just completed the ${certData?.languageDisplayName} course on StudyEarn AI!\n\n✅ ${certData?.totalXP} XP earned across 12 weeks\n📜 Certificate ID: ${certData?.certificateId}\n\n🚀 Learn coding for free: studyearnai.tech`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback for mobile
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // ── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#08081a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🎓</div>
          <div className="text-gray-400">Checking certificate...</div>
        </div>
      </div>
    );
  }

  // ── Not earned yet ───────────────────────────────────────────
  if (error) {
    const completed = progressInfo?.sectionsCompleted || 0;
    const needed = progressInfo?.totalNeeded || 48;
    const percent = Math.round((completed / needed) * 100);

    return (
      <div className="min-h-screen bg-[#08081a] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-2xl text-white font-bold mb-3">Certificate Not Earned Yet</h2>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Complete all 12 weeks and mark all sections as read to earn your certificate.
          </p>

          {progressInfo && (
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-8 text-left">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Sections Completed</span>
                <span className="text-violet-400 font-semibold">{completed} / {needed}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${courseInfo?.color}`}
                  style={{ width: `${percent}%`, transition: 'width 0.5s' }}
                />
              </div>
              <p className="text-center text-gray-500 text-xs">
                {needed - completed} more sections to go!
              </p>
            </div>
          )}

          <button
            onClick={() => navigate(`/codelearn/${language}`)}
            className={`w-full px-6 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-semibold hover:opacity-90 transition-all`}
          >
            Continue Course →
          </button>
          <button
            onClick={() => navigate('/codelearn')}
            className="mt-3 text-gray-600 hover:text-gray-400 text-sm transition-colors"
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  // ── Certificate earned ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#08081a] py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(`/codelearn/${language}`)}
          className="flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Course
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Congratulations! Course Complete!
          </h1>
          <p className="text-gray-400">
            You've earned your <span className={courseInfo?.textClass}>{certData.languageDisplayName}</span> certificate
          </p>
        </div>

        {/* Name customizer */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {editingName ? (
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                placeholder="Enter your name..."
                className="bg-transparent text-white text-sm outline-none w-48"
                autoFocus
                maxLength={40}
              />
              <button
                onClick={handleSaveName}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Name on certificate:</span>
              <span className="text-white font-medium text-sm">{displayName}</span>
              <button
                onClick={() => { setNameInput(displayName); setEditingName(true); }}
                className="text-gray-500 hover:text-violet-400 transition-colors ml-1"
                title="Edit name"
              >
                <Edit2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Canvas Certificate */}
        <div className="flex justify-center mb-8">
          <canvas
            ref={canvasRef}
            className="w-full max-w-3xl rounded-2xl shadow-2xl shadow-yellow-500/10 border border-yellow-500/10"
            style={{ aspectRatio: '900/640' }}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 flex-wrap mb-8">
          <button
            onClick={handleDownload}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-semibold hover:opacity-90 transition-all shadow-lg`}
          >
            <Download size={18} />
            Download Certificate
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-gray-300 hover:bg-white/5 transition-all"
          >
            <Share2 size={16} />
            {copied ? 'Copied! ✓' : 'Share'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { label: 'XP Earned', value: certData.totalXP, icon: '⚡' },
            { label: 'Weeks', value: '12', icon: '📅' },
            { label: 'Certificate ID', value: certData.certificateId?.slice(0, 8) + '...', icon: '🆔' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-white font-bold text-sm">{stat.value}</div>
              <div className="text-gray-600 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}