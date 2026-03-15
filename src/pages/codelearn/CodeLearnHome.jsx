/**
 * StudyEarn AI — CodeLearn Landing Page
 * Language selection with progress cards
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COURSE_REGISTRY } from '../../data/courses/index.js';

const API_BASE = import.meta.env.VITE_API_URL || 'https://your-render-backend.onrender.com';

export default function CodeLearnHome() {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    // Fetch progress for all available languages
    const fetchAllProgress = async () => {
      try {
        const available = COURSE_REGISTRY.filter(c => c.status === 'available');
        const results = await Promise.allSettled(
          available.map(course =>
            axios.get(`${API_BASE}/api/codelearn/progress/${course.id}`, {
              headers: { Authorization: `Bearer ${getToken()}` },
            })
          )
        );
        const progressMap = {};
        results.forEach((result, i) => {
          if (result.status === 'fulfilled' && result.value.data.success) {
            progressMap[available[i].id] = result.value.data.progress;
          }
        });
        setUserProgress(progressMap);
      } catch (e) {
        // Silently fail — progress just won't show
      } finally {
        setLoadingProgress(false);
      }
    };
    fetchAllProgress();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative px-4 pt-16 pb-12 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-1.5 mb-6 text-sm text-violet-300">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            New Feature — Beta Launch
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Code Seekho.
            </span>
            <br />
            <span className="text-white">Pro Bano. Earn Karo.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            W3Schools jaisa — but gamified, AI-powered aur 100% free.
            3 mahine mein noob se pro. Certificate bhi milega! 🎓
          </p>

          {/* Stats row */}
          <div className="flex justify-center gap-8 mb-12 flex-wrap">
            {[
              { value: '5', label: 'Languages' },
              { value: '12', label: 'Weeks / Language' },
              { value: '48+', label: 'Sections' },
              { value: '🎓', label: 'Certificate' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-violet-400">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Language Cards Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-semibold text-gray-300 mb-6 text-center">
          Apni Language Choose Karo 👇
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COURSE_REGISTRY.map(course => {
            const progress = userProgress[course.id];
            const percent = progress?.percentComplete || 0;
            const started = percent > 0;
            const isAvailable = course.status === 'available';

            return (
              <div
                key={course.id}
                onClick={() => isAvailable && navigate(`/codelearn/${course.id}`)}
                className={`
                  relative rounded-2xl border p-6 transition-all duration-300
                  ${isAvailable
                    ? `${course.bgClass} cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/10`
                    : 'bg-gray-900/30 border-gray-800/50 cursor-not-allowed opacity-60'
                  }
                `}
              >
                {/* Coming soon badge */}
                {!isAvailable && (
                  <div className="absolute top-3 right-3 bg-gray-700 text-gray-400 text-xs px-2 py-1 rounded-full">
                    Coming Soon
                  </div>
                )}

                {/* Certificate badge if complete */}
                {progress?.certificateIssued && (
                  <div className="absolute top-3 right-3 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    🎓 Certified
                  </div>
                )}

                {/* Language info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">{course.emoji}</div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold ${course.textClass}`}>{course.name}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{course.tagline}</p>
                  </div>
                </div>

                {/* Difficulty badge */}
                <div className={`inline-block text-xs px-3 py-1 rounded-full mb-4 ${course.badgeClass}`}>
                  {course.difficulty}
                </div>

                {/* Topics preview */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {course.topics.slice(0, 4).map(topic => (
                    <span
                      key={topic}
                      className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 4 && (
                    <span className="text-xs text-gray-600">+{course.topics.length - 4} more</span>
                  )}
                </div>

                {/* Progress bar (if started) */}
                {started && !loadingProgress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>Progress</span>
                      <span className={course.textClass}>{percent}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Week {progress.currentWeek} of {course.totalWeeks} • {progress.totalXP} XP
                    </div>
                  </div>
                )}

                {/* Job roles */}
                <div className="border-t border-white/5 pt-4">
                  <div className="text-xs text-gray-600 mb-2">Career Paths:</div>
                  <div className="flex flex-wrap gap-1">
                    {course.jobRoles.slice(0, 3).map(role => (
                      <span key={role} className="text-xs text-gray-500 bg-white/[0.03] px-2 py-0.5 rounded">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                {isAvailable && (
                  <div className={`mt-4 text-center text-sm font-medium ${course.textClass} ${started ? '' : 'opacity-70'}`}>
                    {progress?.certificateIssued
                      ? '🎓 View Certificate'
                      : started
                      ? `Continue → Week ${progress.currentWeek}`
                      : 'Start Learning →'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feature highlights */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🤖', title: 'AI Hints', desc: 'Stuck ho? Groq AI se hint lo instantly' },
            { icon: '💻', title: 'Live Editor', desc: 'Seedha browser mein code likho aur run karo' },
            { icon: '🎮', title: 'Gamified', desc: 'XP, streaks, badges — coding fun hai!' },
            { icon: '🎓', title: 'Certificate', desc: 'Completion pe sharable certificate milega' },
          ].map(f => (
            <div key={f.title} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-medium text-white mb-1">{f.title}</div>
              <div className="text-xs text-gray-600">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}