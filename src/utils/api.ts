// // src/utils/api.ts - Fixed URLs for production

// const API_URL = import.meta.env.VITE_API_URL || 'https://studyearn-backend.onrender.com';

// // ✅ Ask AI
// export async function askAIFromServer(userId: string, question: string, image?: string) {
//   try {
//     const response = await fetch(`${API_URL}/api/ai/ask`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify({ prompt: question, image }),
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('AI API Error:', error);
//     return {
//       success: false,
//       answer: 'Failed to connect to AI service. Please try again.',
//     };
//   }
// }

// // ✅ Generate PPT
// export async function generatePPT(topic: string, slides: any[]) {
//   try {
//     const response = await fetch(`${API_URL}/api/ppt/generate`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: JSON.stringify({ topic, slides }),
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('PPT API Error:', error);
//     return {
//       success: false,
//       message: 'Failed to connect to PPT service. Please try again.',
//     };
//   }
// }

// // ✅ Convert Images to PDF
// export async function convertImagesToPDF(files: File[]) {
//   try {
//     const formData = new FormData();
//     files.forEach(file => formData.append('files', file));

//     const response = await fetch(`${API_URL}/api/img-to-pdf`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: formData,
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('PDF Conversion Error:', error);
//     return {
//       success: false,
//       message: 'Failed to connect to PDF service. Please try again.',
//     };
//   }
// }

// // ✅ Merge PDFs
// export async function mergePDFs(files: File[]) {
//   try {
//     const formData = new FormData();
//     files.forEach(file => formData.append('files', file));

//     const response = await fetch(`${API_URL}/api/merge-pdf`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//       },
//       body: formData,
//     });

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('PDF Merge Error:', error);
//     return {
//       success: false,
//       message: 'Failed to connect to PDF service. Please try again.',
//     };
//   }
// }

// export { API_URL };

import axios from "axios";

const AI_BASE = import.meta.env.VITE_API_URL;
const FILE_BASE = "http://localhost:5001";

// ─── ASK AI ──────────────────────────────────────────────────────────────────
export async function askAIFromServer(
  userId: string,
  question: string,
  image?: string,
) {
  try {
    const res = await axios.post(`${AI_BASE}/api/ai`, {
      prompt: question,
      image: image,
      userId: userId,
    });
    return res.data;
  } catch (error: any) {
    console.error("askAIFromServer error:", error.message);
    return { success: false, answer: "Server not reachable. Is backend running on port 5000?" };
  }
}

// ─── IMAGES TO PDF ───────────────────────────────────────────────────────────
// NOTE: Do NOT set Content-Type manually - let browser set it with boundary
export async function convertImagesToPDF(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const res = await fetch(`${FILE_BASE}/api/img-to-pdf`, {
      method: "POST",
      body: formData,
      // NO headers - fetch sets multipart boundary automatically
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("convertImagesToPDF error:", err.message);
    return { success: false, message: "PDF conversion failed. Is backend running on port 5001?" };
  }
}

// ─── MERGE PDFs ───────────────────────────────────────────────────────────────
export async function mergePDF(files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  try {
    const res = await fetch(`${FILE_BASE}/api/merge-pdf`, {
      method: "POST",
      body: formData,
      // NO headers - fetch sets multipart boundary automatically
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("mergePDF error:", err.message);
    return { success: false, message: "PDF merge failed. Is backend running on port 5001?" };
  }
}