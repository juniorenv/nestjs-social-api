import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

/**
 * Guard to check if authenticated user owns the resource
 * Works with routes that have :userId parameter
 * Example: PATCH /users/:userId
 */
@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user?.sub) {
      throw new UnauthorizedException("Authentication required");
    }

    const resourceOwnerId = request.params.userId || request.params.authorId;

    if (!resourceOwnerId) {
      return true;
    }

    if (user.sub !== resourceOwnerId) {
      throw new ForbiddenException(
        "You do not have permission to access this resource",
      );
    }

    return true;
  }
}
