// src/utils/api.ts - Fixed URLs for production

const API_URL = import.meta.env.VITE_API_URL || 'https://studyearn-backend.onrender.com';

// ✅ Ask AI
export async function askAIFromServer(userId: string, question: string, image?: string) {
  try {
    const response = await fetch(`${API_URL}/api/ai/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ prompt: question, image }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI API Error:', error);
    return {
      success: false,
      answer: 'Failed to connect to AI service. Please try again.',
    };
  }
}

// ✅ Generate PPT
export async function generatePPT(topic: string, slides: any[]) {
  try {
    const response = await fetch(`${API_URL}/api/ppt/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ topic, slides }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('PPT API Error:', error);
    return {
      success: false,
      message: 'Failed to connect to PPT service. Please try again.',
    };
  }
}

// ✅ Convert Images to PDF
export async function convertImagesToPDF(files: File[]) {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch(`${API_URL}/api/img-to-pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('PDF Conversion Error:', error);
    return {
      success: false,
      message: 'Failed to connect to PDF service. Please try again.',
    };
  }
}

// ✅ Merge PDFs
export async function mergePDFs(files: File[]) {
  try {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch(`${API_URL}/api/merge-pdf`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('PDF Merge Error:', error);
    return {
      success: false,
      message: 'Failed to connect to PDF service. Please try again.',
    };
  }
}

export { API_URL };
