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


// ================= SPLIT PDF =================
export async function splitPDF(file: File, pages: string) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("pages", pages);
    const res = await fetch(`${API_URL}/api/split-pdf`, { method: "POST", headers: { ...getAuthHeader() }, body: formData });
    if (!res.ok) throw new Error(`Server Error: ${res.status}`);
    const blob = await res.blob();
    return { success: true, url: URL.createObjectURL(blob) };
  } catch (e: any) { return { success: false, message: e.message }; }
}

// ================= COMPRESS PDF =================
export async function compressPDF(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/compress-pdf`, { method: "POST", headers: { ...getAuthHeader() }, body: formData });
    if (!res.ok) throw new Error(`Server Error: ${res.status}`);
    const blob = await res.blob();
    const savings = res.headers.get("X-Savings-Percent") || "0";
    const origKB  = res.headers.get("X-Original-Size") || "0";
    const compKB  = res.headers.get("X-Compressed-Size") || "0";
    return { success: true, url: URL.createObjectURL(blob), savings, origKB, compKB };
  } catch (e: any) { return { success: false, message: e.message }; }
}

// ================= ROTATE PDF =================
export async function rotatePDF(file: File, degrees: number) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("degrees", String(degrees));
    const res = await fetch(`${API_URL}/api/rotate-pdf`, { method: "POST", headers: { ...getAuthHeader() }, body: formData });
    if (!res.ok) throw new Error(`Server Error: ${res.status}`);
    const blob = await res.blob();
    return { success: true, url: URL.createObjectURL(blob) };
  } catch (e: any) { return { success: false, message: e.message }; }
}

// ================= ADD PAGE NUMBERS =================
export async function addPageNumbers(file: File, position: string) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", position);
    const res = await fetch(`${API_URL}/api/pdf-page-numbers`, { method: "POST", headers: { ...getAuthHeader() }, body: formData });
    if (!res.ok) throw new Error(`Server Error: ${res.status}`);
    const blob = await res.blob();
    return { success: true, url: URL.createObjectURL(blob) };
  } catch (e: any) { return { success: false, message: e.message }; }
}

// ================= WATERMARK PDF =================
export async function watermarkPDF(file: File, text: string) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);
    const res = await fetch(`${API_URL}/api/pdf-watermark`, { method: "POST", headers: { ...getAuthHeader() }, body: formData });
    if (!res.ok) throw new Error(`Server Error: ${res.status}`);
    const blob = await res.blob();
    return { success: true, url: URL.createObjectURL(blob) };
  } catch (e: any) { return { success: false, message: e.message }; }
}

// ================= WORD → PDF =================
export async function wordToPDF(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/word-to-pdf`, { method: "POST", headers: { ...getAuthHeader() }, body: formData });
    if (!res.ok) throw new Error(`Server Error: ${res.status}`);
    const blob = await res.blob();
    return { success: true, url: URL.createObjectURL(blob) };
  } catch (e: any) { return { success: false, message: e.message }; }
}

// ================= PPT → PDF =================
export async function pptToPDF(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/ppt-to-pdf`, { method: "POST", headers: { ...getAuthHeader() }, body: formData });
    if (!res.ok) throw new Error(`Server Error: ${res.status}`);
    const blob = await res.blob();
    return { success: true, url: URL.createObjectURL(blob) };
  } catch (e: any) { return { success: false, message: e.message }; }
}

// ================= EXCEL → PDF =================
export async function excelToPDF(file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/excel-to-pdf`, { method: "POST", headers: { ...getAuthHeader() }, body: formData });
    if (!res.ok) throw new Error(`Server Error: ${res.status}`);
    const blob = await res.blob();
    return { success: true, url: URL.createObjectURL(blob) };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export { API_URL };