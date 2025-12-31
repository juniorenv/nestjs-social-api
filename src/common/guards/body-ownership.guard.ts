import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

/**
 * Guard to check if a field in request body matches authenticated user
 * Requires @OwnerField decorator to specify which field to check
 * Example: POST /comments with @OwnerField('authorId')
 */
@Injectable()
export class BodyOwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user?.sub) {
      throw new UnauthorizedException("Authentication required");
    }

    const ownerField = this.reflector.get<string>(
      "ownerField",
      context.getHandler(),
    );

    if (!ownerField) {
      return true;
    }

    const body = request.body as Record<string, unknown>;
    const ownerIdFromBody = body[ownerField];

    if (!ownerIdFromBody) {
      throw new BadRequestException(
        `${ownerField} is required in request body`,
      );
    }

    if (typeof ownerIdFromBody !== "string") {
      throw new BadRequestException(`${ownerField} must be a string`);
    }

    if (user.sub !== ownerIdFromBody) {
      throw new ForbiddenException(
        "You can only create resources for yourself",
      );
    }

    return true;
  }
}
