/**
 * StudyEarn AI — Course Page
 * Week → Section navigator + content area + XP tracker
 *
 * MOBILE CHANGES (md:hidden only):
 *   1. ☰ hamburger button in header (md:hidden)
 *   2. Slide-in drawer for sidebar (md:hidden)
 *   3. Desktop sidebar: hidden md:block (invisible on mobile, same on desktop)
 *
 * DESKTOP: 100% unchanged from original
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadCourse, COURSE_REGISTRY } from '../../data/courses/index.js';
import { useCodeLearn } from '../../hooks/useCodeLearn';
import SectionViewer from '../../components/codelearn/SectionViewer';
import { ChevronRight, ChevronDown, Lock, CheckCircle, Circle, Trophy, Zap, Flame, Menu, X } from 'lucide-react';

export default function CoursePage() {
  const { language } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);
  const [expandedWeek, setExpandedWeek] = useState(1);
  const [lang, setLang] = useState(() => localStorage.getItem('cl_lang') || 'en');
  // ── MOBILE ONLY ──
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const switchLang = (l) => {
    setLang(l);
    localStorage.setItem('cl_lang', l);
  };

  const { progress, loading: progressLoading, isSectionCompleted, isSectionQuizPassed: hookQuizPassed, isSectionUnlocked, completeSection, submitQuiz, getHint, getExplanation } = useCodeLearn(language);

  const isSectionQuizPassed = hookQuizPassed;
  const courseInfo = COURSE_REGISTRY.find(c => c.id === language);

  useEffect(() => {
    loadCourse(language)
      .then(data => { setCourseData(data); setLoadingCourse(false); })
      .catch((err) => {
        console.error('[CodeLearn] loadCourse failed:', err);
        // Don't redirect — show error so we can debug
        setLoadingCourse(false);
      });
  }, [language]);

  const initialSelectionDone = React.useRef(false);
  useEffect(() => {
    if (!courseData || !progress) return;
    if (initialSelectionDone.current) return;
    const currentWeek = courseData.weeks.find(w => w.week === progress.currentWeek);
    if (currentWeek) {
      const currentSec = currentWeek.sections[Math.min(progress.currentSection - 1, currentWeek.sections.length - 1)];
      if (currentSec) {
        setSelectedSection({ weekNumber: currentWeek.week, section: currentSec });
        setExpandedWeek(currentWeek.week);
        initialSelectionDone.current = true;
      }
    }
  }, [courseData, progress]);

  if (loadingCourse || (progressLoading && !progress)) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">{courseInfo?.emoji}</div>
          <div className="text-gray-400">Loading {courseInfo?.name} course...</div>
        </div>
      </div>
    );
  }

  if (!courseData) return null;

  const totalSections = courseData.weeks.reduce((sum, w) => sum + w.sections.length, 0);
  const completedSections = progress?.sections?.filter(s => s.quizScore != null && s.quizScore >= 70)?.length || 0;

  // ── Sidebar content — same JSX reused in desktop sidebar + mobile drawer ──
  const SidebarContent = ({ onSectionClick = null }) => (
    <div className="p-4">
      {courseData.weeks.map(week => {
        const weekCompleted = week.sections.every(s => isSectionQuizPassed(s.id));
        const weekStarted   = week.sections.some(s => isSectionCompleted(s.id));
        const isExpanded    = expandedWeek === week.week;
        const weekUnlocked  = week.week === 1 ||
          isSectionUnlocked(week.week, 0, week.sections, courseData.weeks);

        return (
          <div key={week.week} className="mb-2">
            {/* Week header — ORIGINAL */}
            <button
              onClick={() => weekUnlocked && setExpandedWeek(isExpanded ? null : week.week)}
              className={`w-full flex items-center gap-2 p-3 rounded-lg text-left transition-all
                ${weekUnlocked ? 'hover:bg-white/5 cursor-pointer' : 'cursor-not-allowed opacity-40'}
                ${weekStarted ? 'bg-white/[0.03]' : ''}
              `}
            >
              {!weekUnlocked ? (
                <Lock size={14} className="text-gray-600 shrink-0" />
              ) : weekCompleted ? (
                <CheckCircle size={14} className="text-green-400 shrink-0" />
              ) : (
                <Circle size={14} className="text-gray-600 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Week {week.week}</span>
                  {weekCompleted && (
                    <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">✓ Done</span>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-300 truncate">{week.title}</div>
              </div>
              {weekUnlocked && (
                <ChevronDown size={14} className={`text-gray-600 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Sections — ORIGINAL */}
            {isExpanded && weekUnlocked && (
              <div className="ml-4 mt-1 space-y-0.5">
                {week.sections.map((section, idx) => {
                  const completed = isSectionCompleted(section.id);
                  const unlocked  = weekUnlocked && isSectionUnlocked(week.week, idx, week.sections, courseData.weeks);
                  const isActive  = selectedSection?.section?.id === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        if (unlocked) {
                          setSelectedSection({ weekNumber: week.week, section });
                          onSectionClick?.(); // only closes mobile drawer, noop on desktop
                        }
                      }}
                      className={`
                        w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all text-sm
                        ${isActive ? `${courseInfo?.bgClass} ${courseInfo?.textClass}` : ''}
                        ${unlocked && !isActive ? 'hover:bg-white/5 text-gray-400' : ''}
                        ${!unlocked ? 'opacity-40 cursor-not-allowed text-gray-600' : 'cursor-pointer'}
                      `}
                    >
                      <span className="text-base shrink-0 w-6 text-center">{section.emoji}</span>
                      <span className="flex-1 leading-tight">{section.title}</span>
                      {completed && <CheckCircle size={13} className="text-green-400 shrink-0" />}
                      {!unlocked && <Lock size={13} className="shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Certificate — ORIGINAL */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <button
          onClick={() => navigate(`/codelearn/${language}/certificate`)}
          className={`w-full flex items-center gap-2 p-3 rounded-lg text-left
            ${progress?.certificateIssued
              ? 'bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/15 cursor-pointer'
              : 'opacity-40 cursor-not-allowed bg-white/[0.02]'
            } transition-all`}
        >
          <Trophy size={16} className={progress?.certificateIssued ? 'text-yellow-400' : 'text-gray-600'} />
          <div>
            <div className="text-sm font-medium text-gray-300">Certificate</div>
            <div className="text-xs text-gray-600">
              {progress?.certificateIssued ? 'Download karo! 🎉' : 'Complete all 12 weeks'}
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      {/* ── TOP HEADER — ORIGINAL, sirf ek ☰ button add kiya md:hidden ── */}
      <div className="border-b border-white/5 bg-[#0d0d14] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">

          {/* ☰ MOBILE ONLY — desktop pe dikhta hi nahi */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
          >
            <Menu size={20} />
          </button>

          {/* Back — ORIGINAL */}
          <button
            onClick={() => navigate('/codelearn')}
            className="text-gray-500 hover:text-white text-sm flex items-center gap-1 transition-colors hidden md:flex"
          >
            ← Back
          </button>

          {/* Course title — ORIGINAL */}
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xl">{courseInfo?.emoji}</span>
            <span className={`font-semibold ${courseInfo?.textClass}`}>{courseInfo?.name}</span>
            <span className="text-gray-600 text-sm hidden md:block">— {courseInfo?.tagline}</span>
          </div>

          {/* Stats + Lang toggle — ORIGINAL */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-0.5">
              <button onClick={() => switchLang('en')} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}>EN</button>
              <button onClick={() => switchLang('hi')} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${lang === 'hi' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}>HI</button>
            </div>
            <div className="flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1">
              <Zap size={13} className="text-violet-400" />
              <span className="text-violet-300 font-medium">{progress?.totalXP || 0} XP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full px-3 py-1 hidden md:flex">
              <Flame size={13} className="text-orange-400" />
              <span className="text-orange-300 font-medium">{progress?.currentStreak || 0} days</span>
            </div>
            <div className="text-gray-500 text-xs hidden lg:block">
              {completedSections}/{totalSections} sections
            </div>
          </div>
        </div>

        {/* Progress bar — ORIGINAL */}
        <div className="max-w-7xl mx-auto mt-2">
          <div className="w-full bg-gray-800/50 rounded-full h-1">
            <div
              className={`h-1 rounded-full bg-gradient-to-r ${courseInfo?.color} transition-all duration-700`}
              style={{ width: `${Math.round((completedSections / totalSections) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MOBILE DRAWER — md:hidden, desktop pe exist nahi
      ══════════════════════════════════════════════════ */}

      {/* Dark overlay — tap karke close */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div className={`
        fixed top-0 left-0 h-full w-72 max-w-[80vw]
        bg-[#0c0c13] border-r border-white/5 overflow-y-auto
        z-50 md:hidden
        transition-transform duration-300 ease-in-out
        ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Drawer top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 sticky top-0 bg-[#0c0c13]">
          <div className="flex items-center gap-2">
            <span className="text-lg">{courseInfo?.emoji}</span>
            <span className={`text-sm font-semibold ${courseInfo?.textClass}`}>{courseInfo?.name}</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="text-gray-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Same sidebar content, onSectionClick closes drawer */}
        <SidebarContent onSectionClick={() => setMobileSidebarOpen(false)} />
      </div>

      {/* ══════════════════════════════════════════════════
          MAIN LAYOUT — ORIGINAL (desktop unchanged)
      ══════════════════════════════════════════════════ */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">

        {/* Desktop sidebar — ORIGINAL classes, just added hidden md:block */}
        <div className="hidden md:block w-72 shrink-0 border-r border-white/5 bg-[#0c0c13] overflow-y-auto max-h-[calc(100vh-100px)] sticky top-0">
          <SidebarContent />
        </div>

        {/* Main content area — ORIGINAL */}
        <div className="flex-1 overflow-auto">
          {selectedSection ? (
            <SectionViewer
              lang={lang}
              language={language}
              courseInfo={courseInfo}
              weekNumber={selectedSection.weekNumber}
              section={selectedSection.section}
              isContentRead={isSectionCompleted(selectedSection.section.id)}
              isQuizPassed={isSectionQuizPassed(selectedSection.section.id)}
              onComplete={completeSection}
              onQuizSubmit={submitQuiz}
              onGetHint={getHint}
              onGetExplanation={getExplanation}
              onNext={() => {
                const currentWeek = courseData.weeks.find(w => w.week === selectedSection.weekNumber);
                const currentIdx  = currentWeek.sections.findIndex(s => s.id === selectedSection.section.id);
                if (currentIdx < currentWeek.sections.length - 1) {
                  const nextUnlocked = isSectionQuizPassed(selectedSection.section.id);
                  if (nextUnlocked) {
                    setSelectedSection({ weekNumber: currentWeek.week, section: currentWeek.sections[currentIdx + 1] });
                    setExpandedWeek(currentWeek.week);
                  }
                } else {
                  const allCurrentWeekPassed = currentWeek.sections.every(s => isSectionQuizPassed(s.id));
                  if (allCurrentWeekPassed) {
                    const nextWeek = courseData.weeks.find(w => w.week === selectedSection.weekNumber + 1);
                    if (nextWeek) {
                      setExpandedWeek(nextWeek.week);
                      setSelectedSection({ weekNumber: nextWeek.week, section: nextWeek.sections[0] });
                    }
                  }
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-6xl mb-4">{courseInfo?.emoji}</div>
              <h2 className={`text-2xl font-bold mb-2 ${courseInfo?.textClass}`}>
                {courseInfo?.name} Course
              </h2>
              <p className="text-gray-500 mb-6 max-w-sm">
                Left sidebar se koi section select karo ya apna current section continue karo.
              </p>
              <button
                onClick={() => {
                  const w1 = courseData.weeks[0];
                  setExpandedWeek(1);
                  setSelectedSection({ weekNumber: 1, section: w1.sections[0] });
                }}
                className={`px-6 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-opacity`}
              >
                {completedSections > 0 ? 'Continue Learning →' : 'Start Course →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}