import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SendEmailDto } from '../dto/send-email.dto';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    constructor(
        private configService: ConfigService,
    ) { }

    async sendEmail(sendEmailDto: SendEmailDto): Promise<boolean> {

        let transporter = createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: this.configService.get('EMAIL_PORT'),
            secure: this.configService.get('EMAIL_SECURE'),
            greetingTimeout: 15000,
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASSWORD')
            }
        });
        let emailOption = {
            from: `"${this.configService.get('EMAIL_NAME')}" <${this.configService.get('EMAIL_USER')}>`,
            to: sendEmailDto.toEmail,
            subject: sendEmailDto.subject,
            text: sendEmailDto.message
        }

        try {
            await transporter.sendMail(emailOption);
        } catch (error) {
            throw new HttpException('Error on sending Email', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
        return true;
    }
}