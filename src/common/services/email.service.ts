import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationEmail(email: string, code: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Email Verification - Blend',
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
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: email,
      subject: 'Welcome to Blend!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Blend, ${firstName}!</h2>
          <p style="font-size: 16px; color: #555;">Your email has been successfully verified. You can now enjoy all the features of our platform!</p>
          <p style="font-size: 14px; color: #777;">Start exploring our products and place your first order.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">This is an automated email, please do not reply.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
