import { SubscriptionsService } from '@/gebril_videos/services/subscriptions.service';
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsSubscribedGuard implements CanActivate {
    constructor(
        private subscriptionsService: SubscriptionsService,
    ) {}

    async canActivate(
        context: ExecutionContext,
    ) {
        const request = context.switchToHttp().getRequest();
        const isSubscribed = await this.subscriptionsService.userIsSubscribed(request.user.id);
        if (isSubscribed == false) {
            throw new ForbiddenException('NO_ACTIVE_SUBSCRIPTIONS');
        }
        return true;
    }
}