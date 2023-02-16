import { SetMetadata } from '@nestjs/common';

export enum Role {
    SuperAdmin = 1,
    CallCenter = 2,
  }
  
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
