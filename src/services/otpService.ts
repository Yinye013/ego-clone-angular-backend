import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import crypto from "crypto";

interface OtpRecord {
  id: string;
  otp: string;
  code: string;
  expiresAt: Date;
}

export class OtpService {
  private static otpStore: Map<string, OtpRecord> = new Map(); //learnt this is kind of a small store with key value pairs

  static generateOTP(userId: string, email: string): string {
    const otp = crypto.randomInt(100000, 999999).toString();
    const code = crypto.randomBytes(3).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const otpRecord: OtpRecord = {
      id: userId,
      otp,
      code,
      expiresAt,
    };

    this.otpStore.set(userId, otpRecord);
    console.log(`OTP generated for ${email} (${userId}): ${otp}`);

    return otp;
  }

  static verifyOTP(userId: string, code: string) {
    const record = this.otpStore.get(userId);
    if (!record) {
      console.log(`🔐 OTP verification failed for ${userId}: No record found`);
      return false;
    }

    if (record.code !== code) {
      console.log(` OTP verification failed for ${userId}: Invalid code`);
      return false;
    }

    if (record.expiresAt < new Date()) {
      console.log(` OTP verification failed for ${userId}: OTP expired`);
      this.otpStore.delete(userId);
      return false;
    }

    console.log(`OTP verified successfully for ${userId}`);
    this.otpStore.delete(userId);
    return true;
  }

  static hasValidOTP(userId: string): boolean {
    const record = this.otpStore.get(userId);
    if (!record) {
      return false;
    }
    return record.expiresAt > new Date();
    // returns a boolean
  }
}
