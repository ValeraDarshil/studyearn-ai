/**
 * StudyEarn AI — Input Validation Middleware
 * ─────────────────────────────────────────────────────────────
 * Validates + sanitizes all request inputs before they reach
 * route handlers. Prevents:
 *   - XSS attacks (script injection)
 *   - Oversized payloads crashing the server
 *   - Invalid data types causing runtime errors
 *   - Missing required fields
 */

import { Request, Response, NextFunction } from 'express';

// ─────────────────────────────────────────────────────────────
// HELPER UTILS
// ─────────────────────────────────────────────────────────────

/** Strip dangerous HTML/script tags from a string */
function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')       // Remove all HTML tags
    .replace(/javascript:/gi, '')  // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '')    // Remove event handlers (onclick= etc)
    .trim();
}

/** Check if a string is a valid email */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/** Returns MB size of a base64 string */
function base64SizeMB(b64: string): number {
  // base64 string length * 0.75 = actual bytes
  return (b64.length * 0.75) / (1024 * 1024);
}

// ─────────────────────────────────────────────────────────────
// 1. VALIDATE AI ASK REQUEST
//    Checks: prompt length, image size, image format
// ─────────────────────────────────────────────────────────────
export function validateAskAI(req: Request, res: Response, next: NextFunction) {
  const { prompt, image } = req.body;

  // Either prompt or image must be present
  if (!prompt && !image) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a question or upload an image.',
    });
  }

  // Prompt validation
  if (prompt !== undefined) {
    if (typeof prompt !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid prompt format.' });
    }
    if (prompt.length > 5000) {
      return res.status(400).json({
        success: false,
        message: 'Question is too long. Please keep it under 5000 characters.',
      });
    }
    // Sanitize the prompt (reassign cleaned version)
    req.body.prompt = sanitizeString(prompt);
  }

  // Image validation
  if (image !== undefined) {
    if (typeof image !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid image format.' });
    }

    // Check it's a valid base64 image data URL
    const isDataUrl = image.startsWith('data:image/');
    const isRawBase64 = /^[A-Za-z0-9+/]+=*$/.test(image.substring(0, 100));

    if (!isDataUrl && !isRawBase64) {
      return res.status(400).json({ success: false, message: 'Invalid image format. Please upload a valid image.' });
    }

    // Check image size (max 8MB decoded)
    const sizeToCheck = isDataUrl ? image.split(',')[1] || image : image;
    if (base64SizeMB(sizeToCheck) > 8) {
      return res.status(400).json({
        success: false,
        message: 'Image is too large. Please compress or resize it (max 8MB).',
      });
    }
  }

  next();
}

// ─────────────────────────────────────────────────────────────
// 2. VALIDATE PPT CONTENT REQUEST
// ─────────────────────────────────────────────────────────────
export function validatePPTContent(req: Request, res: Response, next: NextFunction) {
  const { topic, style, classLevel } = req.body;

  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    return res.status(400).json({ success: false, message: 'Topic is required.' });
  }

  // Sanitize and length-check topic
  const cleanTopic = sanitizeString(topic.trim());
  if (cleanTopic.length < 2) {
    return res.status(400).json({ success: false, message: 'Topic is too short.' });
  }
  if (cleanTopic.length > 150) {
    return res.status(400).json({
      success: false,
      message: 'Topic is too long. Please keep it under 150 characters.',
    });
  }
  req.body.topic = cleanTopic;

  // Validate style
  const validStyles = ['simple', 'detailed', 'creative'];
  if (style && !validStyles.includes(style)) {
    return res.status(400).json({
      success: false,
      message: `Invalid style. Choose from: ${validStyles.join(', ')}`,
    });
  }

  // Validate classLevel
  const validLevels = ['8', '9', '10', '11', '12', 'Undergraduate', 'Postgraduate'];
  if (classLevel && !validLevels.includes(classLevel)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid class level.',
    });
  }

  next();
}

// ─────────────────────────────────────────────────────────────
// 3. VALIDATE AUTH — Signup
// ─────────────────────────────────────────────────────────────
export function validateSignup(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  // Name validation
  const cleanName = sanitizeString(String(name).trim());
  if (cleanName.length < 2 || cleanName.length > 50) {
    return res.status(400).json({ success: false, message: 'Name must be 2-50 characters.' });
  }
  req.body.name = cleanName;

  // Email validation
  const cleanEmail = String(email).trim().toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }
  req.body.email = cleanEmail;

  // Password validation
  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
  }
  if (password.length > 100) {
    return res.status(400).json({ success: false, message: 'Password is too long.' });
  }

  next();
}

// ─────────────────────────────────────────────────────────────
// 4. VALIDATE AUTH — Login
// ─────────────────────────────────────────────────────────────
export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }
  req.body.email = cleanEmail;

  if (typeof password !== 'string' || password.length < 1) {
    return res.status(400).json({ success: false, message: 'Password is required.' });
  }

  next();
}

// ─────────────────────────────────────────────────────────────
// 5. VALIDATE PPT GENERATE (final slide generation)
// ─────────────────────────────────────────────────────────────
export function validatePPTGenerate(req: Request, res: Response, next: NextFunction) {
  const { topic, slides, style, classLevel } = req.body;

  if (!slides || !Array.isArray(slides) || slides.length === 0) {
    return res.status(400).json({ success: false, message: 'No slides provided.' });
  }

  if (slides.length > 20) {
    return res.status(400).json({ success: false, message: 'Too many slides. Maximum is 20.' });
  }

  // Validate each slide has required fields
  for (const slide of slides) {
    if (!slide.title || typeof slide.title !== 'string') {
      return res.status(400).json({ success: false, message: 'Each slide must have a title.' });
    }
  }

  // Sanitize topic
  if (topic) {
    req.body.topic = sanitizeString(String(topic).trim()).substring(0, 150);
  }

  next();
}