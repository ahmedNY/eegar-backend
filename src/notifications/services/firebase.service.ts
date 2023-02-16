import { Injectable } from '@nestjs/common';
import { SendPushNotificationDto } from '../dto/send-push-notification.dto';
import { IResponseBody, Message, Sender } from "node-gcm";
import { ConfigService } from '@nestjs/config';
import { SendBulkPushNotificationDto } from '../dto/send-bulk-push-notification.dto';
import { listSplitter } from '../utils/list-splitter';
import { SendDataByPushNotificationDto } from '../dto/send-data-by-push-notification.dto';

@Injectable()
export class FirebaseService {
    constructor(
        configService: ConfigService,
    ) {
        this._sender = new Sender(configService.get('FIREBASE_SERVER_KEY'));
    }

    private _sender: Sender;

    private _send(message: Message, registerationIds: string | string[]): Promise<IResponseBody> {
        return new Promise((resolve, reject) => {
            this._sender.send(message, registerationIds, 8, (err, res) => {
                if (err) {
                    return reject(err);
                }
                return resolve(res);
            })
        })
    }

    async sendPushNotification(sendPushNotificationDto: SendPushNotificationDto) {
        const message = new Message({
            priority: 'HIGH',
            notification: {
                title: sendPushNotificationDto.title,
                body: sendPushNotificationDto.text,
                click_action: sendPushNotificationDto.click_action,
                icon: sendPushNotificationDto.image,
            },
            data: sendPushNotificationDto.data,
        });


        const resp = await this._send(message, sendPushNotificationDto.to);

        if (resp.failure) {
            throw resp;
        }

        return true;
    }

    async sendBulkPushNotification(dto: SendBulkPushNotificationDto) {
        if (!dto.title && !dto.data) {
            throw new Error('you must provide either title or data');
        }
        const message = new Message({
            priority: 'HIGH',
            notification: {
                title: dto.title,
                body: dto.body,
                click_action: dto.click_action,
                icon: dto.image,
            },
            data: dto.data,
        });

        const registerationTokensList = listSplitter(dto.registrationTokens, 400);

        for (const chunk of registerationTokensList) {
            let resp: IResponseBody;
            try {
                resp = await this._send(message, chunk);
            } catch (error) {
                continue;
            }

            if (resp.failure) {
                throw resp;
            }
        }

        return true;
    }


    async sendDataByPushNotification(sendDataByPushNotificationDto: SendDataByPushNotificationDto) {
        const { data, registrationToken } = sendDataByPushNotificationDto;
        const message = new Message({ priority: 'HIGH', data });
        const resp = await this._send(message, registrationToken);
        if (resp.failure) {
            throw resp;
        }
        return true;
    }
}