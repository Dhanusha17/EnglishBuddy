import { IEmailProvider } from './IEmailProvider';
import { ConsoleEmailProvider } from './ConsoleEmailProvider';
import { SmtpEmailProvider } from './SmtpEmailProvider';

export class EmailService {
  private provider: IEmailProvider;

  constructor(provider?: IEmailProvider) {
    if (provider) {
      this.provider = provider;
    } else {
      this.provider = process.env.EMAIL_API_KEY ? new SmtpEmailProvider() : new ConsoleEmailProvider();
    }
  }

  private wrapTemplate(title: string, contentHtml: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f9; color: #1e293b; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 28px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
            .content { padding: 32px 24px; font-size: 15px; line-height: 1.6; }
            .button { display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 16px; margin-bottom: 16px; }
            .footer { background-color: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EnglishBuddy</h1>
            </div>
            <div class="content">
              <h2>${title}</h2>
              ${contentHtml}
            </div>
            <div class="footer">
              <p>© 2026 EnglishBuddy Learning Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const html = this.wrapTemplate(
      'Welcome to EnglishBuddy!',
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Welcome to the ultimate English language mastery & campus placement platform!</p>
       <p>Get started by completing your placement assessment and setting up your daily study target.</p>
       <a href="${process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://englishbuddy.app')}/dashboard" class="button">Go to Dashboard</a>`
    );
    return await this.provider.sendEmail({ to, subject: 'Welcome to EnglishBuddy!', html });
  }

  async sendVerificationEmail(to: string, name: string, verificationLink: string): Promise<boolean> {
    const html = this.wrapTemplate(
      'Verify Your Email Address',
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Please click the button below to verify your email address and activate full access to your account:</p>
       <a href="${verificationLink}" class="button">Verify Email Address</a>
       <p style="font-size: 13px; color: #64748b;">If you did not sign up for an account, please ignore this email.</p>`
    );
    return await this.provider.sendEmail({ to, subject: 'Verify your EnglishBuddy email', html });
  }

  async sendPasswordResetEmail(to: string, name: string, resetLink: string): Promise<boolean> {
    const html = this.wrapTemplate(
      'Password Reset Request',
      `<p>Hi <strong>${name}</strong>,</p>
       <p>We received a request to reset your password. Click the link below to set a new password:</p>
       <a href="${resetLink}" class="button">Reset Password</a>
       <p style="font-size: 13px; color: #64748b;">This link will expire in 60 minutes. If you did not request a password reset, your account remains secure.</p>`
    );
    return await this.provider.sendEmail({ to, subject: 'Password Reset Request', html });
  }

  async sendWeeklyProgressReport(to: string, name: string, stats: { lessonsCompleted: number; xpEarned: number; streakDays: number }): Promise<boolean> {
    const html = this.wrapTemplate(
      'Your Weekly Progress Summary 🚀',
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Here is how you performed this week on EnglishBuddy:</p>
       <ul>
         <li><strong>Lessons Completed:</strong> ${stats.lessonsCompleted}</li>
         <li><strong>XP Earned:</strong> ${stats.xpEarned} XP</li>
         <li><strong>Active Streak:</strong> ${stats.streakDays} Days 🔥</li>
       </ul>
       <a href="${process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://englishbuddy.app')}/dashboard/progress" class="button">View Progress Dashboard</a>`
    );
    return await this.provider.sendEmail({ to, subject: 'Your Weekly EnglishBuddy Progress', html });
  }

  async sendCertificateNotification(to: string, name: string, certTitle: string, certCode: string): Promise<boolean> {
    const downloadUrl = `${process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://englishbuddy.app')}/api/certificates/${certCode}/download`;
    const html = this.wrapTemplate(
      'Congratulations! Certificate Earned 🏆',
      `<p>Hi <strong>${name}</strong>,</p>
       <p>Congratulations on achieving your official certificate for <strong>${certTitle}</strong>!</p>
       <p>Your unique Certificate ID is <code>${certCode}</code>.</p>
       <a href="${downloadUrl}" class="button">Download PDF Certificate</a>`
    );
    return await this.provider.sendEmail({ to, subject: `Certificate Earned: ${certTitle}`, html });
  }

  async sendPlacementAlert(to: string, name: string, alertTitle: string, details: string): Promise<boolean> {
    const html = this.wrapTemplate(
      `Placement Alert: ${alertTitle}`,
      `<p>Hi <strong>${name}</strong>,</p>
       <p>${details}</p>
       <a href="${process.env.NEXT_PUBLIC_APP_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://englishbuddy.app')}/dashboard/placement" class="button">Open Placement Hub</a>`
    );
    return await this.provider.sendEmail({ to, subject: `Placement Alert: ${alertTitle}`, html });
  }
}

export const emailService = new EmailService();
