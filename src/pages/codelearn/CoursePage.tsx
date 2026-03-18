// @ts-check — Mobile-first responsive CoursePage
/**
 * StudyEarn AI — Course Page
 * Mobile-first: sidebar drawer on mobile, fixed on desktop
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadCourse, COURSE_REGISTRY } from '../../data/courses/index.js';
import { useCodeLearn } from '../../hooks/useCodeLearn';
import SectionViewer from '../../components/codelearn/SectionViewer';
import {
  ChevronDown, Lock, CheckCircle, Circle,
  Trophy, Zap, Flame, Menu, X, ArrowLeft, BookOpen
} from 'lucide-react';

export default function CoursePage() {
  const { language }   = useParams();
  const navigate       = useNavigate();
  const [courseData, setCourseData]   = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [expandedWeek, setExpandedWeek]       = useState<number | null>(1);
  const [sidebarOpen, setSidebarOpen]         = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem('cl_lang') || 'en');

  const switchLang = (l: string) => { setLang(l); localStorage.setItem('cl_lang', l); };

  const {
    progress, loading: progressLoading,
    isSectionCompleted, isSectionQuizPassed: hookQuizPassed,
    isSectionUnlocked, completeSection, submitQuiz, getHint, getExplanation,
  } = useCodeLearn(language);

  const isSectionQuizPassed = hookQuizPassed;
  const courseInfo = COURSE_REGISTRY.find(c => c.id === language);

  useEffect(() => {
    loadCourse(language)
      .then(data => { setCourseData(data); setLoading(false); })
      .catch(() => navigate('/codelearn'));
  }, [language]);

  // Auto-select current section on first load
  const initialDone = React.useRef(false);
  useEffect(() => {
    if (!courseData || !progress || initialDone.current) return;
    const week = courseData.weeks.find((w: any) => w.week === progress.currentWeek);
    if (week) {
      const sec = week.sections[Math.min(progress.currentSection - 1, week.sections.length - 1)];
      if (sec) {
        setSelectedSection({ weekNumber: week.week, section: sec });
        setExpandedWeek(week.week);
        initialDone.current = true;
      }
    }
  }, [courseData, progress]);

  // Close sidebar on section select (mobile)
  const selectSection = useCallback((weekNumber: number, section: any) => {
    setSelectedSection({ weekNumber, section });
    setSidebarOpen(false); // auto-close on mobile
  }, []);

  if (loading || (progressLoading && !progress)) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">{courseInfo?.emoji}</div>
          <div className="text-gray-400 text-sm">Loading {courseInfo?.name}...</div>
        </div>
      </div>
    );
  }

  if (!courseData) return null;

  const totalSections     = courseData.weeks.reduce((s: number, w: any) => s + w.sections.length, 0);
  const completedSections = progress?.sections?.filter((s: any) => s.quizScore != null && s.quizScore >= 70)?.length || 0;
  const progressPct       = Math.round((completedSections / totalSections) * 100);

  // ── Sidebar content (shared between drawer + desktop) ────────────
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Mobile close button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 md:hidden">
        <span className="text-sm font-semibold text-gray-300">Course Syllabus</span>
        <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-white p-1">
          <X size={18} />
        </button>
      </div>

      {/* Week list */}
      <div className="flex-1 overflow-y-auto p-3">
        {courseData.weeks.map((week: any) => {
          const weekCompleted = week.sections.every((s: any) => isSectionQuizPassed(s.id));
          const weekStarted   = week.sections.some((s: any) => isSectionCompleted(s.id));
          const isExpanded    = expandedWeek === week.week;
          const weekUnlocked  = week.week === 1 || isSectionUnlocked(week.week, 0, week.sections, courseData.weeks);

          return (
            <div key={week.week} className="mb-1">
              <button
                onClick={() => weekUnlocked && setExpandedWeek(isExpanded ? null : week.week)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all
                  ${weekUnlocked ? 'hover:bg-white/5 cursor-pointer' : 'cursor-not-allowed opacity-40'}
                  ${weekStarted && !weekCompleted ? 'bg-white/[0.03]' : ''}
                `}
              >
                {!weekUnlocked ? (
                  <Lock size={13} className="text-gray-600 shrink-0" />
                ) : weekCompleted ? (
                  <CheckCircle size={13} className="text-green-400 shrink-0" />
                ) : (
                  <Circle size={13} className="text-gray-600 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-600 uppercase tracking-wide">Week {week.week}</span>
                    {weekCompleted && <span className="text-[10px] text-green-400">✓ Done</span>}
                  </div>
                  <div className="text-xs font-medium text-gray-300 truncate leading-tight">{week.title}</div>
                </div>
                {weekUnlocked && (
                  <ChevronDown size={13} className={`text-gray-600 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                )}
              </button>

              {isExpanded && weekUnlocked && (
                <div className="ml-3 mt-0.5 space-y-0.5">
                  {week.sections.map((section: any, idx: number) => {
                    const completed = isSectionCompleted(section.id);
                    const unlocked  = weekUnlocked && isSectionUnlocked(week.week, idx, week.sections, courseData.weeks);
                    const isActive  = selectedSection?.section?.id === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => unlocked && selectSection(week.week, section)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all
                          ${isActive ? `${courseInfo?.bgClass} ${courseInfo?.textClass}` : ''}
                          ${unlocked && !isActive ? 'hover:bg-white/5 text-gray-400 active:bg-white/10' : ''}
                          ${!unlocked ? 'opacity-40 cursor-not-allowed text-gray-600' : 'cursor-pointer'}
                        `}
                      >
                        <span className="text-sm shrink-0">{section.emoji}</span>
                        <span className="flex-1 text-xs leading-tight truncate">{section.title}</span>
                        {completed && <CheckCircle size={11} className="text-green-400 shrink-0" />}
                        {!unlocked && <Lock size={11} className="shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Certificate */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <button
            onClick={() => navigate(`/codelearn/${language}/certificate`)}
            className={`w-full flex items-center gap-2 p-3 rounded-lg text-left transition-all
              ${progress?.certificateIssued
                ? 'bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/15'
                : 'opacity-40 cursor-not-allowed bg-white/[0.02]'
              }`}
          >
            <Trophy size={14} className={progress?.certificateIssued ? 'text-yellow-400' : 'text-gray-600'} />
            <div className="min-w-0">
              <div className="text-xs font-medium text-gray-300">Certificate</div>
              <div className="text-[10px] text-gray-600 truncate">
                {progress?.certificateIssued ? 'Download karo! 🎉' : `${completedSections}/${totalSections} complete`}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">

      {/* ── TOP HEADER ── */}
      <div className="border-b border-white/5 bg-[#0d0d14] px-3 md:px-4 py-2.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-4">

          {/* Mobile: hamburger menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-500 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
            aria-label="Open syllabus"
          >
            <Menu size={18} />
          </button>

          {/* Back button */}
          <button
            onClick={() => navigate('/codelearn')}
            className="hidden md:flex text-gray-500 hover:text-white text-sm items-center gap-1 transition-colors shrink-0"
          >
            <ArrowLeft size={14} /> Back
          </button>

          {/* Course title */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-lg shrink-0">{courseInfo?.emoji}</span>
            <span className={`font-semibold text-sm truncate ${courseInfo?.textClass}`}>{courseInfo?.name}</span>
          </div>

          {/* Right side stats */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Lang toggle */}
            <div className="flex items-center gap-0.5 bg-white/5 border border-white/10 rounded-full p-0.5">
              <button onClick={() => switchLang('en')} className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-violet-600 text-white' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => switchLang('hi')} className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${lang === 'hi' ? 'bg-violet-600 text-white' : 'text-gray-400'}`}>HI</button>
            </div>
            {/* XP */}
            <div className="flex items-center gap-1 bg-violet-500/10 border border-violet-500/20 rounded-full px-2.5 py-1">
              <Zap size={11} className="text-violet-400" />
              <span className="text-violet-300 font-medium text-xs">{progress?.totalXP || 0}</span>
            </div>
            {/* Streak — hidden on very small */}
            <div className="hidden sm:flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 rounded-full px-2.5 py-1">
              <Flame size={11} className="text-orange-400" />
              <span className="text-orange-300 font-medium text-xs">{progress?.currentStreak || 0}d</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-7xl mx-auto mt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-800/50 rounded-full h-1">
              <div
                className={`h-1 rounded-full bg-gradient-to-r ${courseInfo?.color} transition-all duration-700`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-600 shrink-0">{completedSections}/{totalSections}</span>
          </div>
        </div>
      </div>

      {/* ── MOBILE SIDEBAR DRAWER OVERLAY ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden"
          style={{ backdropFilter: 'blur(2px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      <div className={`
        fixed left-0 top-0 h-full w-72 max-w-[85vw] bg-[#0c0c13] border-r border-white/5
        z-50 transition-transform duration-300 ease-in-out md:hidden
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full overflow-hidden">

        {/* Desktop sidebar — always visible */}
        <div className="hidden md:flex w-64 lg:w-72 shrink-0 border-r border-white/5 bg-[#0c0c13] max-h-[calc(100vh-90px)] sticky top-[90px] flex-col">
          <SidebarContent />
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="flex-1 overflow-auto min-w-0">
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
                const currentWeek = courseData.weeks.find((w: any) => w.week === selectedSection.weekNumber);
                const currentIdx  = currentWeek.sections.findIndex((s: any) => s.id === selectedSection.section.id);
                if (currentIdx < currentWeek.sections.length - 1) {
                  if (isSectionQuizPassed(selectedSection.section.id)) {
                    selectSection(currentWeek.week, currentWeek.sections[currentIdx + 1]);
                  }
                } else {
                  const allPassed = currentWeek.sections.every((s: any) => isSectionQuizPassed(s.id));
                  if (allPassed) {
                    const nextWeek = courseData.weeks.find((w: any) => w.week === selectedSection.weekNumber + 1);
                    if (nextWeek) {
                      setExpandedWeek(nextWeek.week);
                      selectSection(nextWeek.week, nextWeek.sections[0]);
                    }
                  }
                }
              }}
            />
          ) : (
            /* Welcome screen */
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-12">
              <div className="text-5xl mb-4">{courseInfo?.emoji}</div>
              <h2 className={`text-xl md:text-2xl font-bold mb-2 ${courseInfo?.textClass}`}>
                {courseInfo?.name}
              </h2>
              <p className="text-gray-500 text-sm mb-6 max-w-xs leading-relaxed">
                {completedSections > 0
                  ? `${completedSections} sections complete! Continue karo.`
                  : 'Pehla section select karo ya start karo!'}
              </p>
              <button
                onClick={() => {
                  const w1 = courseData.weeks[0];
                  setExpandedWeek(1);
                  selectSection(1, w1.sections[0]);
                }}
                className={`px-6 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium text-sm hover:opacity-90 transition-opacity`}
              >
                {completedSections > 0 ? 'Continue Learning →' : 'Start Course →'}
              </button>
              {/* Mobile hint */}
              <p className="md:hidden text-xs text-gray-700 mt-6 flex items-center gap-1">
                <Menu size={12} /> Tap menu to browse weeks
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}