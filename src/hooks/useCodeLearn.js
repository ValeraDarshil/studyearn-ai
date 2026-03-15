/**
 * StudyEarn AI — useCodeLearn Hook
 * Progress management, API calls, section/quiz state
 */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://your-render-backend.onrender.com';

export function useCodeLearn(language) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => localStorage.getItem('token');
  const headers = () => ({ Authorization: `Bearer ${getToken()}` });

  // Fetch progress
  const fetchProgress = useCallback(async () => {
    if (!language) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/codelearn/progress/${language}`, { headers: headers() });
      if (res.data.success) setProgress(res.data.progress);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  // Check if a section is completed
  const isSectionCompleted = useCallback((sectionId) => {
    return progress?.sections?.some(s => s.sectionId === sectionId && s.completed) || false;
  }, [progress]);

  // Check if a section is unlocked (sequential unlock)
  const isSectionUnlocked = useCallback((weekNumber, sectionIndex, sections) => {
    if (weekNumber === 1 && sectionIndex === 0) return true; // First section always unlocked

    // Previous section must be complete
    if (sectionIndex > 0) {
      const prevSection = sections[sectionIndex - 1];
      return isSectionCompleted(prevSection.id);
    }

    // First section of a new week — last section of prev week must be done
    if (weekNumber > 1) {
      // Check if prev week's last section quiz was passed
      const prevWeekSections = progress?.sections?.filter(s => s.weekNumber === weekNumber - 1) || [];
      return prevWeekSections.some(s => s.quizScore >= 70);
    }
    return false;
  }, [progress, isSectionCompleted]);

  // Mark section as complete
  const completeSection = useCallback(async (weekNumber, sectionNumber, sectionId) => {
    try {
      const res = await axios.post(`${API_BASE}/api/codelearn/complete-section`, {
        language, weekNumber, sectionNumber, sectionId,
      }, { headers: headers() });

      if (res.data.success) {
        await fetchProgress();
        return res.data;
      }
    } catch (err) {
      console.error('completeSection error:', err);
      return null;
    }
  }, [language, fetchProgress]);

  // Submit quiz
  const submitQuiz = useCallback(async (weekNumber, sectionNumber, sectionId, score, totalQuestions) => {
    try {
      const res = await axios.post(`${API_BASE}/api/codelearn/submit-quiz`, {
        language, weekNumber, sectionNumber, sectionId, score, totalQuestions,
      }, { headers: headers() });

      if (res.data.success) {
        await fetchProgress();
        return res.data;
      }
    } catch (err) {
      console.error('submitQuiz error:', err);
      return null;
    }
  }, [language, fetchProgress]);

  // Get AI hint
  const getHint = useCallback(async (sectionId, code, taskDescription) => {
    try {
      const res = await axios.post(`${API_BASE}/api/codelearn/ai-hint`, {
        language, sectionId, code, taskDescription,
      }, { headers: headers() });
      return res.data;
    } catch (err) {
      return { success: false, hint: 'Could not get hint. Try again!' };
    }
  }, [language]);

  // Get AI explanation
  const getExplanation = useCallback(async (code, concept) => {
    try {
      const res = await axios.post(`${API_BASE}/api/codelearn/ai-explain`, {
        language, code, concept,
      }, { headers: headers() });
      return res.data;
    } catch (err) {
      return { success: false, explanation: 'Could not explain. Try again!' };
    }
  }, [language]);

  // Run code
  const runCode = useCallback(async (code, expectedOutput, sectionId) => {
    try {
      const res = await axios.post(`${API_BASE}/api/codelearn/run-code`, {
        language, code, expectedOutput, sectionId,
      }, { headers: headers() });
      return res.data;
    } catch (err) {
      return { success: false, output: 'Execution failed. Try again.' };
    }
  }, [language]);

  // Get certificate
  const getCertificate = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/codelearn/certificate/${language}`, {
        headers: headers(),
      });
      return res.data;
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  }, [language]);


  // Translate content — with localStorage cache
  const translateContent = useCallback(async (sectionId, rawContent, targetLang) => {
    if (targetLang === 'hi') return rawContent; // Hinglish is native

    const cacheKey = `cl_trans_${sectionId}_${targetLang}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached; // Cache hit!

    try {
      const res = await axios.post(
        `${API_BASE}/api/codelearn/translate-content`,
        { content: rawContent, targetLang, sectionId },
        { headers: headers() }
      );
      if (res.data.success) {
        localStorage.setItem(cacheKey, res.data.translated);
        return res.data.translated;
      }
    } catch (err) {
      console.error('Translation error:', err);
    }
    return rawContent; // fallback to original
  }, []);

  return {
    progress,
    loading,
    error,
    isSectionCompleted,
    isSectionUnlocked,
    completeSection,
    submitQuiz,
    getHint,
    getExplanation,
    runCode,
    getCertificate,
    translateContent,
    refresh: fetchProgress,
  };
}