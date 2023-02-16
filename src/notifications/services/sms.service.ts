import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendSMSDto } from '../dto/send-sms.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SendSMSResponseDto } from '../dto/send-sms-response.dto';
import { listSplitter } from '../utils/list-splitter';


@Injectable()
export class SMSService {
    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
    ) { }

    async sendSMS(sendSMSDto: SendSMSDto): Promise<SendSMSResponseDto> {
        const numbers = sendSMSDto.phoneNumber.split(";");

        // split phone numbers into chunks, because of the limit of SMS gateway provider
        const batchedNumbers: string[][] = listSplitter(numbers, 50);

        const smsText = sendSMSDto.message;
        const sender = sendSMSDto.sender ?? this.configService.get('SMS_SENDER');

        const failedBatchAttempt1: string[][] = [];
        for (const chunk of batchedNumbers) {
            try {
                await this.sendBatch(chunk, smsText, sender);
                await wait(100);
            } catch (error) {
                failedBatchAttempt1.push(chunk);
            }
        }


        const failedBatch: string[][] = [];
        // attempt to resend to the failed batch
        if (failedBatchAttempt1.length > 0) {
            for (const chunk of failedBatchAttempt1) {
                try {
                    await this.sendBatch(chunk, smsText, sender);
                    await wait(100);
                } catch (error) {
                    failedBatch.push(chunk);
                }
            }
        }

        const faieldCount = failedBatch.length == 0 ? 0 : failedBatch.map((batch) => batch.length)?.reduce((previousValue, currentValue) => previousValue + currentValue);
        const successCount = numbers.length - faieldCount;
        return {
            success: successCount,
            failed: faieldCount,
        };
    }


    private async sendBatch(phoneNumbers: string[], smsText: string, sender: string) {
        const sendSmsURL = this.configService.get('SMS_URL');
        const params = {
            user: this.configService.get('SMS_USER'),
            pwd: this.configService.get('SMS_PASSWORD'),
            smstext: smsText,
            Sender: sender,
            Nums: phoneNumbers.join(";"),
        }
        const httpResponse = await firstValueFrom(this.httpService.get<string>(sendSmsURL, { params }));
        let response = httpResponse.data.split('\n')[0].trim();
        if (response != 'OK') {
            throw Error('Failed to send SMS: ' + response);
        }
    }

    async getBalance(): Promise<number> {
        const getSMSBalanceUrl = this.configService.get('SMS_URL_BALANCE');
        const params = {
            user: this.configService.get('SMS_USER'),
            pwd: this.configService.get('SMS_PASSWORD'),
        }
        const httpResponse = await firstValueFrom(this.httpService.get(getSMSBalanceUrl, { params }))
        return httpResponse.data;
    }
}

async function wait(ms: number) {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    });
}
