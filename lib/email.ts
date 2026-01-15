import nodemailer from 'nodemailer';

// Email service for sending OTP emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP email to user
 * @param email - Recipient email address
 * @param otp - 6-digit OTP code
 * @param name - User's name
 */
export async function sendOTP(email: string, otp: string, name: string): Promise<void> {
  const mailOptions = {
    from: `"University Exam Portal" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Your Login Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #1a202c;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 4px;
              overflow: hidden;
            }
            .header {
              background: #003366;
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
            .content {
              padding: 30px;
            }
            .otp-box {
              background: #f8f9fa;
              border: 2px solid #003366;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #003366;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .footer {
              background: #f8f9fa;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #64748b;
              border-top: 1px solid #cbd5e1;
            }
            .warning {
              color: #d32f2f;
              font-size: 14px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">University Exam Portal</h1>
              <p style="margin: 5px 0 0 0;">Secure Examination System</p>
            </div>
            <div class="content">
              <h2 style="color: #003366; margin-top: 0;">Hello ${name},</h2>
              <p>You have requested to log in to the University Exam Portal. Please use the verification code below to complete your login:</p>
              
              <div class="otp-box">
                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">Your Verification Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; color: #64748b; font-size: 12px;">Valid for 5 minutes</p>
              </div>
              
              <p>If you did not request this code, please ignore this email or contact support immediately.</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this code with anyone. University staff will never ask for your verification code.
              </div>
            </div>
            <div class="footer">
              <p>This is an automated message from the University Secure Examination Portal.</p>
              <p>© ${new Date().getFullYear()} University Exam Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Hello ${name},

You have requested to log in to the University Exam Portal.

Your Verification Code: ${otp}

This code is valid for 5 minutes.

If you did not request this code, please ignore this email or contact support immediately.

Security Notice: Never share this code with anyone. University staff will never ask for your verification code.

---
University Secure Examination Portal
© ${new Date().getFullYear()} University Exam Portal. All rights reserved.
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
}

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
