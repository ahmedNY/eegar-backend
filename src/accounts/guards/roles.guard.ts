import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from '../decorators/role.decorator';
import { IsAuthenticatedGuard } from './is-authenticated.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly isAuthenticatedGuard = new IsAuthenticatedGuard();
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticatedGuard = await (this.isAuthenticatedGuard.canActivate(context));
    if (isAuthenticatedGuard == false) {
        return false;
    }
    
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.map((r) => r.id)?.includes(role));
  }
}