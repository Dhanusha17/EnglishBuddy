import { IEmailProvider, EmailOptions } from './IEmailProvider';

export class SmtpEmailProvider implements IEmailProvider {
  private apiKey: string;
  private defaultFrom: string;

  constructor() {
    this.apiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY || '';
    this.defaultFrom = process.env.EMAIL_FROM || 'EnglishBuddy <noreply@englishbuddy.app>';
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('SmtpEmailProvider: No EMAIL_API_KEY set. Falling back to console log.');
      console.log(`[EMAIL TO ${options.to}] Subject: ${options.subject}`);
      return true;
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: options.from || this.defaultFrom,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      return res.ok;
    } catch (error) {
      console.error('SmtpEmailProvider send error:', error);
      return false;
    }
  }
}
