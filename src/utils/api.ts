// src/utils/api.ts - COMPLETE FINAL STABLE VERSION

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("❌ VITE_API_URL is not defined");
}

// ================= COMMON HELPER =================
function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ================= ASK AI =================
export async function askAIFromServer(
  userId: string,
  question: string,
  image?: string
) {
  try {
    const response = await fetch(`${API_URL}/api/ai/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ prompt: question, image }),
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("AI API Error:", error);
    return {
      success: false,
      answer: "Failed to connect to AI service. Please try again.",
    };
  }
}

// ================= GENERATE PPT =================
export async function generatePPT(topic: string, slides: any[]) {
  try {
    const response = await fetch(`${API_URL}/api/ppt/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({ topic, slides }),
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("PPT API Error:", error);
    return {
      success: false,
      message: "Failed to connect to PPT service. Please try again.",
    };
  }
}

// ================= IMAGE → PDF =================
export async function convertImagesToPDF(files: File[]) {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(`${API_URL}/api/img-to-pdf`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("PDF Conversion Error:", error);
    return {
      success: false,
      message: "Failed to connect to PDF service. Please try again.",
    };
  }
}

// ================= MERGE PDF =================
export async function mergePDFs(files: File[]) {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch(`${API_URL}/api/merge-pdf`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    return {
      success: true,
      url,
    };
  } catch (error) {
    console.error("PDF Merge Error:", error);
    return {
      success: false,
      message: "Failed to connect to PDF service. Please try again.",
    };
  }
}

export { API_URL };