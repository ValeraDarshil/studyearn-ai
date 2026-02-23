// import axios from "axios";

// const API_BASE = "http://localhost:5000";

// export async function askAIFromServer(userId: string, question: string, image?: string) {
//   try {
//     const response = await axios.post(`${API_BASE}/api/ai`, {
//       prompt: question,
//       image: image,
//     });

//     return response.data; // <-- IMPORTANT
//   } catch (error: any) {
//     console.error(error.response?.data || error.message);
//     return { success:false, answer:"Server not reachable" };
//   }
// }

// export async function convertImagesToPDF(files: File[]) {
//   const formData = new FormData();

//   files.forEach(file => {
//     formData.append("files", file);
//   });

//   try {
//     const res = await axios.post(`${API_BASE}/api/img-to-pdf`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     return res.data;
//   } catch (err) {
//     return { success: false };
//   }
// }

// export async function mergePDF(files: File[]) {
//   const formData = new FormData();

//   files.forEach((file) => {
//     formData.append("files", file);
//   });

//   const res = await fetch("http://localhost:5000/api/merge-pdf", {
//     method: "POST",
//     body: formData,
//   });

//   return await res.json();
// }




// // import axios from "axios";

// // const API_BASE = "http://localhost:5000";

// // export async function convertImagesToPDF(files: File[]) {
// //   const formData = new FormData();
// //   files.forEach(f => formData.append("files", f));

// //   const res = await axios.post(`${API_BASE}/api/img-to-pdf`, formData);
// //   return res.data;
// // }

// // export async function mergePDF(files: File[]) {
// //   const formData = new FormData();
// //   files.forEach(f => formData.append("files", f));

// //   const res = await axios.post(`${API_BASE}/api/merge-pdf`, formData);
// //   return res.data;
// // }


// ---------- calude ai ---------- //

import axios from "axios";

const AI_BASE = "http://localhost:5000";
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