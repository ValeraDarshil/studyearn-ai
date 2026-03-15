/**
 * StudyEarn AI — QuizModal Component
 * Gamified quiz with timer, scoring, animations
 */
import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, XCircle, Trophy, Zap, RotateCcw, ChevronRight } from 'lucide-react';

const QUESTION_TIME = 30; // seconds per question

export default function QuizModal({ questions, sectionTitle, courseInfo, onComplete, onClose }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]); // {selected, correct, isCorrect}[]
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizPhase, setQuizPhase] = useState('question'); // question | result
  const [score, setScore] = useState(0);

  const question = questions[currentQ];
  const isLastQuestion = currentQ === questions.length - 1;
  const totalQuestions = questions.length;

  // Timer countdown
  useEffect(() => {
    if (quizPhase !== 'question' || selectedAnswer !== null) return;
    if (timeLeft <= 0) {
      handleAnswer(-1); // Time out = wrong answer
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, quizPhase, selectedAnswer]);

  const handleAnswer = useCallback((optionIndex) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIndex);
    setShowExplanation(true);

    const isCorrect = optionIndex === question.correct;
    const newAnswers = [...answers, { selected: optionIndex, correct: question.correct, isCorrect }];
    setAnswers(newAnswers);
    if (isCorrect) setScore(s => s + 1);
  }, [selectedAnswer, question, answers]);

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizPhase('result');
    } else {
      setCurrentQ(q => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(QUESTION_TIME);
    }
  };

  const finalPercent = Math.round((score / totalQuestions) * 100);
  const passed = finalPercent >= 70;

  // Timer ring
  const timerPercent = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft > 15 ? '#8b5cf6' : timeLeft > 7 ? '#f59e0b' : '#ef4444';

  if (quizPhase === 'result') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
          {/* Result icon */}
          <div className="text-6xl mb-4">{passed ? '🏆' : '😅'}</div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {passed ? 'Quiz Passed!' : 'Almost There!'}
          </h2>

          {/* Score circle */}
          <div className={`
            inline-flex flex-col items-center justify-center w-28 h-28 rounded-full border-4 my-6
            ${passed ? 'border-green-500 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}
          `}>
            <div className={`text-3xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
              {finalPercent}%
            </div>
            <div className="text-xs text-gray-500">{score}/{totalQuestions}</div>
          </div>

          {/* Question breakdown */}
          <div className="flex justify-center gap-2 mb-6">
            {answers.map((a, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${a.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          {passed ? (
            <div className="mb-6">
              <div className="text-green-400 text-sm font-medium mb-1">Next section unlocked! 🔓</div>
              <div className="flex items-center justify-center gap-2 text-violet-300 text-sm">
                <Zap size={14} />
                +{finalPercent === 100 ? 50 : 30} XP earned!
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm mb-6">
              70% chahiye pass ke liye. Dobara try karo! 💪
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {!passed && (
              <button
                onClick={() => {
                  setCurrentQ(0);
                  setSelectedAnswer(null);
                  setAnswers([]);
                  setScore(0);
                  setShowExplanation(false);
                  setTimeLeft(QUESTION_TIME);
                  setQuizPhase('question');
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm"
              >
                <RotateCcw size={14} /> Retry
              </button>
            )}
            <button
              onClick={() => onComplete(score, totalQuestions).then(() => {})}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium text-sm hover:opacity-90 transition-all`}
            >
              {passed ? 'Continue →' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0f0f1a] border border-white/10 rounded-2xl max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="text-sm text-gray-500">
            Question <span className="text-white font-semibold">{currentQ + 1}</span> / {totalQuestions}
          </div>

          {/* Progress bar */}
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full bg-gradient-to-r ${courseInfo?.color} transition-all duration-300`}
                style={{ width: `${((currentQ) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Timer */}
          <div className="relative w-10 h-10 shrink-0">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#1f2937" strokeWidth="3" />
              <circle
                cx="20" cy="20" r="16"
                fill="none"
                stroke={timerColor}
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - timerPercent / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold"
              style={{ color: timerColor }}>{timeLeft}</div>
          </div>

          <button onClick={onClose} className="ml-3 text-gray-600 hover:text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Question */}
        <div className="p-6">
          <h3 className="text-white font-semibold text-lg leading-relaxed mb-6">
            {question.q}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => {
              let style = 'border-white/10 text-gray-300 hover:border-violet-500/50 hover:bg-violet-500/5';
              let icon = null;

              if (selectedAnswer !== null) {
                if (idx === question.correct) {
                  style = 'border-green-500 bg-green-500/10 text-green-300';
                  icon = <CheckCircle size={16} className="text-green-400 shrink-0" />;
                } else if (idx === selectedAnswer && idx !== question.correct) {
                  style = 'border-red-500 bg-red-500/10 text-red-300';
                  icon = <XCircle size={16} className="text-red-400 shrink-0" />;
                } else {
                  style = 'border-white/5 text-gray-600';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 text-sm ${style} ${selectedAnswer === null ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs shrink-0 font-medium
                    ${selectedAnswer === null ? 'border-current' : idx === question.correct ? 'border-green-500 bg-green-500/20' : idx === selectedAnswer ? 'border-red-500 bg-red-500/20' : 'border-gray-700'}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && question.explanation && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-4 animate-fade-in">
              <div className="text-xs text-blue-400 font-medium mb-1.5">💡 Explanation:</div>
              <p className="text-gray-400 text-sm leading-relaxed">{question.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {selectedAnswer !== null && (
            <button
              onClick={handleNext}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${courseInfo?.color} text-white font-medium hover:opacity-90 transition-all`}
            >
              {isLastQuestion ? (
                <><Trophy size={16} /> See Results</>
              ) : (
                <>Next Question <ChevronRight size={16} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}