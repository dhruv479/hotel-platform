import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequired: any = this.reflector.get(Roles, context.getHandler());
    if (!rolesRequired || !Array.isArray(rolesRequired)) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userRole = request?.USER?.role;
    if (!userRole) {
      return false;
    }
    return rolesRequired.includes(userRole);
  }
}
