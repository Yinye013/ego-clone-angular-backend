export class EmailService {
  static async sendOtpEmail(email: string, otpCode: string) {
    console.log(`

EMAIL SENT TO: ${email}

Subject: Your Login Verification Code

Hello,

Your verification code is: ${otpCode}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Regards,
The Egora Team

    `);

    await new Promise((resolve) => setTimeout(resolve, 400));

    return;
  }
}
