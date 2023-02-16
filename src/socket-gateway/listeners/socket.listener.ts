import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RedisPropagatorService } from '../services/redis-propagator.service';

@Injectable()
export class SocketListener {
    constructor(
        private propagateService: RedisPropagatorService,
    ) { }

    @OnEvent('TEST_EVENT')
    async onTripAcceptTimeout(data: any) {
        // notify customer trip timeout
        this.propagateService.propagateEvent({
            event: 'EVENT_NAME',
            userId: 101,
            data: data,
        });
    }

}
