import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Otp } from 'src/accounts/entities/otp.entity';
import * as events from '../../events';
import { SMSService } from '../services/sms.service';

@Injectable()
export class SMSListeners {

    constructor(
        private smsService: SMSService,
    ) { }

    @OnEvent(events.EVENT_OTP_CREATED)
    async handleOTPCreatedEvent(otp: Otp) {
        // ignore 0000
        if (otp.otpToken == '0000') {
            return;
        }
        //TODO: use handlebards template
        const message = `Your code is: ${otp.otpToken} don't share it with others AVrDm81GO3d`;
        this.smsService.sendSMS({
            phoneNumber: otp.phoneNumber,
            message: message,
        })
    }

    @OnEvent(events.EVENT_USER_RESEND_OTP)
    async handleCustomerResendOTPEvent(otp: Otp) {
        //TODO: use handlebards template
        const message = `code: ${otp.otpToken}`;
        this.smsService.sendSMS({
            phoneNumber: otp.phoneNumber,
            message: message,
        })
    }
}
