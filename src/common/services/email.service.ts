import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor(private configService: ConfigService) {
    const resendApiKey = this.configService.get<string>("RESEND_API_KEY");
    this.fromEmail =
      this.configService.get<string>("FROM_EMAIL") || "onboarding@resend.dev";

    console.log("Email Configuration:");
    console.log("RESEND_API_KEY exists:", !!resendApiKey);
    console.log("FROM_EMAIL:", this.fromEmail);

    this.resend = new Resend(resendApiKey);
  }

  async sendVerificationEmail(
    email: string,
    code: string,
    firstName: string
  ): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: "Email Verification - Blend",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Blend, ${firstName}!</h2>
          <p style="font-size: 16px; color: #555;">Thank you for registering with us. Please verify your email address to complete your registration.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="font-size: 14px; color: #777; margin: 0;">Your verification code is:</p>
            <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; margin: 10px 0;">${code}</h1>
          </div>
          <p style="font-size: 14px; color: #777;">This code will expire in 15 minutes.</p>
          <p style="font-size: 14px; color: #777;">If you didn't request this verification, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">This is an automated email, please do not reply.</p>
        </div>
      `,
      });

      if (error) {
        console.error("Error sending verification email:", error);
        throw new Error(`Failed to send verification email: ${error.message}`);
      }

      console.log("Verification email sent successfully:", data);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: "Welcome to Blend!",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Blend, ${firstName}!</h2>
          <p style="font-size: 16px; color: #555;">Your email has been successfully verified. You can now enjoy all the features of our platform!</p>
          <p style="font-size: 14px; color: #777;">Start exploring our products and place your first order.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">This is an automated email, please do not reply.</p>
        </div>
      `,
      });

      if (error) {
        console.error("Error sending welcome email:", error);
        throw new Error(`Failed to send welcome email: ${error.message}`);
      }

      console.log("Welcome email sent successfully:", data);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      throw error;
    }
  }
}
