// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// // ✅ FIX __dirname for ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// const storage = multer.diskStorage({
//   destination: function (_req, _file, cb) {
//     cb(null, UPLOAD_DIR);
//   },
//   filename: function (_req, file, cb) {
//     const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   },
// });

// export const upload = multer({
//   storage,
//   limits: { fileSize: 20 * 1024 * 1024 },
// });

import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (_req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
});
