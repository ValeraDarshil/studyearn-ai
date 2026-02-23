// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { v4 as uuid } from "uuid";
// import mime from "mime-types";

// // ensure folders exist
// const uploadPath = path.join(__dirname, "..", "uploads", "tmp");
// fs.mkdirSync(uploadPath, { recursive: true });

// // allowed types
// const allowedMime = [
//   "image/png",
//   "image/jpeg",
//   "image/jpg",
//   "application/pdf",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   "application/msword",
//   "application/vnd.openxmlformats-officedocument.presentationml.presentation"
// ];

// // storage config
// const storage = multer.diskStorage({
//   destination: (_, __, cb) => {
//     cb(null, uploadPath);
//   },

//   filename: (_, file, cb) => {
//     const ext = mime.extension(file.mimetype) || "bin";
//     cb(null, uuid() + "." + ext);
//   },
// });

// // filter
// const fileFilter: multer.Options["fileFilter"] = (_, file, cb) => {
//   if (allowedMime.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Unsupported file type"));
//   }
// };

// // export upload middleware
// export const upload = multer({
//   storage,
//   limits: {
//     fileSize: 8 * 1024 * 1024, // 8MB
//   },
//   fileFilter,
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
