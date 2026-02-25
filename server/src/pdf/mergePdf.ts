import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { Express } from "express";

export async function mergePDFs(files: Express.Multer.File[]) {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const fileBytes = fs.readFileSync(file.path);
    const pdf = await PDFDocument.load(fileBytes);

    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p) => mergedPdf.addPage(p));
  }

  const mergedBytes = await mergedPdf.save();

  const outputName = uuid() + ".pdf";
  const outputPath = path.join(__dirname, "..", "..", "uploads", "tmp", outputName);

  fs.writeFileSync(outputPath, mergedBytes);

  return {
    filename: outputName,
    url: `/files/${outputName}`,
  };
}
