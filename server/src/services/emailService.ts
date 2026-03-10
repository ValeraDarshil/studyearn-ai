// ─────────────────────────────────────────────────────────────
// StudyEarn AI — Email Service (Resend)
// ─────────────────────────────────────────────────────────────
// Forgot Password OTP email bhejne ke liye
// ─────────────────────────────────────────────────────────────

import { logger } from '../utils/logger.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

// Resend se email bhejo (fetch-based, no extra SDK needed)
async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'StudyEarn AI <onboarding@resend.dev>',
        to,
        subject,
        html,
      }),
    });

    const data = await res.json() as any;

    if (!res.ok) {
      logger.error('Resend error:', data);
      return false;
    }

    logger.info(`Email sent to ${to} | id=${data.id}`);
    return true;
  } catch (err: any) {
    logger.error('Email send failed:', err.message);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// OTP Email Template — Professional HTML
// ─────────────────────────────────────────────────────────────
export async function sendOTPEmail(to: string, name: string, otp: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f1a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f1a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <h1 style="margin:0;font-size:28px;font-weight:800;background:linear-gradient(135deg,#60a5fa,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">
                StudyEarn AI
              </h1>
              <p style="margin:6px 0 0;color:#64748b;font-size:13px;">Your AI-powered study companion</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02));border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:36px 32px;">

              <!-- Icon -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <div style="width:64px;height:64px;background:linear-gradient(135deg,rgba(96,165,250,0.15),rgba(168,85,247,0.15));border:1px solid rgba(96,165,250,0.2);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;font-size:28px;line-height:64px;text-align:center;">
                      🔐
                    </div>
                  </td>
                </tr>
              </table>

              <h2 style="margin:0 0 8px;color:#f1f5f9;font-size:22px;font-weight:700;text-align:center;">
                Reset Your Password
              </h2>
              <p style="margin:0 0 28px;color:#94a3b8;font-size:14px;text-align:center;line-height:1.6;">
                Hey ${name}! Use the OTP below to reset your password.<br/>This code expires in <strong style="color:#f1f5f9;">10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    <div style="background:linear-gradient(135deg,rgba(96,165,250,0.1),rgba(168,85,247,0.1));border:2px solid rgba(96,165,250,0.3);border-radius:16px;padding:20px 32px;display:inline-block;">
                      <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Your OTP</p>
                      <p style="margin:0;color:#f1f5f9;font-size:42px;font-weight:800;letter-spacing:12px;font-family:'Courier New',monospace;">
                        ${otp}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;padding:14px 16px;margin-bottom:8px;">
                <p style="margin:0;color:#fbbf24;font-size:12px;line-height:1.5;">
                  ⚠️ &nbsp;Never share this OTP with anyone. StudyEarn AI will never ask for your OTP.
                </p>
              </div>

              <p style="margin:16px 0 0;color:#475569;font-size:12px;text-align:center;line-height:1.5;">
                If you didn't request a password reset, you can safely ignore this email.<br/>
                Your account remains secure.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;color:#334155;font-size:12px;">
                © 2025 StudyEarn AI &nbsp;•&nbsp; Made with ❤️ for Indian students
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return sendEmail(to, '🔐 Your StudyEarn AI Password Reset OTP', html);
}