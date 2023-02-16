import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const isAuthenticated = (request.isAuthenticated === true);
        if (!isAuthenticated) {
            console.log('IsAuthenticatedGuard:', 'not authenticated', request.url)
        }
        return isAuthenticated;
    }
}