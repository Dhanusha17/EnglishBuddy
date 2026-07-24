import { IEmailProvider, EmailOptions } from './IEmailProvider';

export class ConsoleEmailProvider implements IEmailProvider {
  async sendEmail(options: EmailOptions): Promise<boolean> {
    console.log('====================================================');
    console.log(`[EMAIL DISPATCH - DEV CONSOLE]`);
    console.log(`To: ${options.to}`);
    console.log(`From: ${options.from || 'noreply@englishbuddy.internal'}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body (HTML length ${options.html.length}):\n${options.text || options.html}`);
    console.log('====================================================');
    return true;
  }
}
