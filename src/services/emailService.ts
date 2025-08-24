import { createTransporter } from "../config/email.config";
export class EmailService {
  private static transporter = createTransporter();

  static async sendOtpEmail(email: string, otpCode: string): Promise<boolean> {
    try {
      const mailOptions = {
        from: {
          name: "Egora Team",
          address: "no-reply@egora.com",
        },
        to: email,
        subject: "Your Login Verification Code",
        html: this.generateOtpEmailTemplate(otpCode),
        text: this.generateOtpEmailText(otpCode),
      };

      const result = await this.transporter.sendMail(mailOptions);

      console.log(`✅ OTP email sent successfully to ${email}`);
      console.log(`Message ID: ${result.messageId}`);

      return true;
    } catch (error) {
      console.error(`❌ Failed to send OTP email to ${email}:`, error);
      return false;
    }
  }

  private static generateOtpEmailTemplate(otpCode: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Verification Code</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .otp-code { 
                background: #f8f9fa; 
                border: 2px solid #007bff; 
                border-radius: 8px; 
                font-size: 32px; 
                font-weight: bold; 
                text-align: center; 
                padding: 20px; 
                margin: 20px 0; 
                letter-spacing: 8px;
                color: #007bff;
            }
            .warning { 
                background: #fff3cd; 
                border-left: 4px solid #ffc107; 
                padding: 15px; 
                margin: 20px 0; 
            }
            .footer { 
                text-align: center; 
                margin-top: 30px; 
                padding-top: 20px; 
                border-top: 1px solid #eee; 
                color: #666; 
                font-size: 14px; 
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Email Verification</h1>
            </div>
            
            <p>Hello,</p>
            
            <p>We received a request to verify your email address. Please use the verification code below:</p>
            
            <div class="otp-code">${otpCode}</div>
            
            <div class="warning">
                <strong>Important:</strong> This code will expire in 10 minutes for security reasons.
            </div>
            
            <p>If you didn't request this verification code, please ignore this email and ensure your account is secure.</p>
            
            <div class="footer">
                <p>Best regards,<br>The Egora Team</p>
                <p><em>This is an automated message, please do not reply to this email.</em></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private static generateOtpEmailText(otpCode: string): string {
    return `
Hello,

We received a request to verify your email address.

Your verification code is: ${otpCode}

IMPORTANT: This code will expire in 10 minutes for security reasons.

If you didn't request this verification code, please ignore this email and ensure your account is secure.

Best regards,
The Egora Team

---
This is an automated message, please do not reply to this email.
    `;
  }
}
