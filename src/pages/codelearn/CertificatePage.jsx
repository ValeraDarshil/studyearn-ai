/**
 * StudyEarn AI — Certificate Page
 * Beautiful certificate with signature, shareable as image
 */
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share2, ArrowLeft, Trophy, CheckCircle } from 'lucide-react';
import { COURSE_REGISTRY } from '../../data/courses/index.js';
import { useCodeLearn } from '../../hooks/useCodeLearn.js';

// Certificate renderer using HTML Canvas
function CertificateCanvas({ certData, courseInfo }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !certData) return;
    const ctx = canvas.getContext('2d');
    const W = 900, H = 640;
    canvas.width = W;
    canvas.height = H;

    // Background — dark premium
    ctx.fillStyle = '#08081a';
    ctx.fillRect(0, 0, W, H);

    // Outer border — golden
    ctx.strokeStyle = '#c9a227';
    ctx.lineWidth = 3;
    ctx.strokeRect(16, 16, W - 32, H - 32);

    // Inner border — thinner
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(28, 28, W - 56, H - 56);

    // Corner ornaments (simple diamond shapes)
    const drawCornerDiamond = (x, y) => {
      ctx.fillStyle = '#c9a227';
      ctx.beginPath();
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x + 10, y);
      ctx.lineTo(x, y + 10);
      ctx.lineTo(x - 10, y);
      ctx.closePath();
      ctx.fill();
    };
    drawCornerDiamond(16, 16);
    drawCornerDiamond(W - 16, 16);
    drawCornerDiamond(16, H - 16);
    drawCornerDiamond(W - 16, H - 16);

    // Top decorative line
    const grad = ctx.createLinearGradient(60, 0, W - 60, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, '#c9a227');
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 80);
    ctx.lineTo(W - 60, 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(60, H - 80);
    ctx.lineTo(W - 60, H - 80);
    ctx.stroke();

    // StudyEarn logo area
    ctx.fillStyle = '#c9a227';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('STUDYEARN AI', W / 2, 65);

    // "Certificate of Completion"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px serif';
    ctx.fillText('Certificate of Completion', W / 2, 160);

    // Decorative text
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '15px sans-serif';
    ctx.fillText('This is to certify that', W / 2, 210);

    // Student Name — big and prominent
    ctx.fillStyle = '#c9a227';
    ctx.font = 'bold 52px serif';
    ctx.fillText(certData.userName, W / 2, 285);

    // Underline under name
    const nameWidth = ctx.measureText(certData.userName).width;
    ctx.strokeStyle = 'rgba(201, 162, 39, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - nameWidth / 2 - 20, 298);
    ctx.lineTo(W / 2 + nameWidth / 2 + 20, 298);
    ctx.stroke();

    // "has successfully completed"
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '16px sans-serif';
    ctx.fillText('has successfully completed the full', W / 2, 335);

    // Course name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(certData.languageDisplayName, W / 2, 380);

    // Duration
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '14px sans-serif';
    ctx.fillText('12-Week Comprehensive Course • 48+ Sections • StudyEarn AI', W / 2, 410);

    // XP earned
    ctx.fillStyle = '#8b5cf6';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`${certData.totalXP} XP Earned`, W / 2, 440);

    // Date
    const issueDate = new Date(certData.issuedAt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    // Bottom section — two columns: Date and Signature
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Date of Completion', 100, 530);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(issueDate, 100, 552);

    // Vertical separator
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.moveTo(W / 2, 510);
    ctx.lineTo(W / 2, 575);
    ctx.stroke();

    // Signature side
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '13px sans-serif';
    ctx.fillText('Authorized By', W - 100, 530);

    // Signature (stylized text)
    ctx.fillStyle = '#c9a227';
    ctx.font = 'italic bold 22px serif';
    ctx.fillText('StudyEarn Team', W - 100, 558);

    // Certificate ID
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '11px monospace';
    ctx.fillText(`Certificate ID: ${certData.certificateId}`, W / 2, 605);

    // Language emoji
    ctx.font = '50px sans-serif';
    ctx.fillText(courseInfo?.emoji || '🎓', W / 2, H / 2 - 210);

  }, [certData, courseInfo]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-3xl rounded-xl shadow-2xl shadow-yellow-500/10"
      style={{ aspectRatio: '900/640' }}
    />
  );
}

export default function CertificatePage() {
  const { language } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const courseInfo = COURSE_REGISTRY.find(c => c.id === language);
  const { getCertificate } = useCodeLearn(language);

  useEffect(() => {
    getCertificate().then(result => {
      if (result.success) {
        setCertData(result.certificate);
      } else {
        setError(result.message);
      }
      setLoading(false);
    });
  }, [language]);

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `StudyEarn_${certData.languageDisplayName.replace(/\s/g, '_')}_Certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    const text = `🎓 I just completed the ${certData?.languageDisplayName} course on StudyEarn AI!\n\n${certData?.totalXP} XP earned in 3 months.\n\nLearn coding for free: studyearnai.tech\n\nCertificate ID: ${certData?.certificateId}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08081a] flex items-center justify-center">
        <div className="text-center text-gray-400">Loading certificate...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#08081a] flex items-center justify-center text-center p-8">
        <div>
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl text-white font-bold mb-2">Certificate Not Earned Yet</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate(`/codelearn/${language}`)}
            className={`px-6 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium`}
          >
            Continue Course →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08081a] text-white pb-16">
      {/* Header */}
      <div className="border-b border-yellow-500/10 bg-black/30 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(`/codelearn/${language}`)}
            className="text-gray-500 hover:text-white flex items-center gap-1 text-sm transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-yellow-400" />
            <span className="font-semibold text-yellow-300">Your Certificate</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-10">
        {/* Celebration header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-2">Congratulations, {certData.userName}!</h1>
          <p className="text-gray-400">
            Tumne {certData.languageDisplayName} ka pura course complete kar liya — {certData.totalXP} XP earn kiya!
          </p>
        </div>

        {/* Certificate */}
        <div className="flex justify-center mb-8">
          <CertificateCanvas certData={certData} courseInfo={courseInfo} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'XP Earned', value: certData.totalXP, emoji: '⚡' },
            { label: 'Course', value: certData.languageDisplayName, emoji: courseInfo?.emoji },
            { label: 'Completed', value: new Date(certData.issuedAt).toLocaleDateString('en-IN'), emoji: '📅' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-white font-semibold text-sm">{stat.value}</div>
              <div className="text-gray-600 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold hover:opacity-90 transition-all"
          >
            <Download size={18} />
            Download Certificate
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 transition-all font-medium"
          >
            <Share2 size={18} />
            {copied ? 'Copied! ✓' : 'Share on Social'}
          </button>
        </div>

        {/* Certificate ID */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-full px-4 py-2 text-xs text-gray-600">
            <CheckCircle size={12} className="text-green-400" />
            Certificate ID: {certData.certificateId}
          </div>
        </div>

        {/* Next language CTA */}
        <div className="mt-10 text-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
          <p className="text-gray-400 mb-4">Next language seekhna chahte ho? 🚀</p>
          <button
            onClick={() => navigate('/codelearn')}
            className="px-6 py-3 rounded-xl bg-violet-600 text-white font-medium hover:bg-violet-500 transition-colors"
          >
            More Languages Dekho →
          </button>
        </div>
      </div>
    </div>
  );
}