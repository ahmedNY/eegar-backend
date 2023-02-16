import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Injectable()
export class IsAdminGuard implements CanActivate {
    constructor(
        private usersService: UsersService,
    ) {}

    async canActivate(
        context: ExecutionContext,
    ) {
        const request = context.switchToHttp().getRequest();
        const isAdmin = await this.usersService.userIsAdmin(request.user.id);
        if (isAdmin == false) {
            throw new ForbiddenException('You are not admin!');
        }
        return true;
    }
}