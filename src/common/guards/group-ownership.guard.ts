import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { GroupService } from "src/group/group.service";
import { validate as isUUID } from "uuid";

/**
 * Guard to check if authenticated user is the group owner
 * Validates UUID format before checking ownership
 * Handles routes with single or multiple UUID parameters
 */
@Injectable()
export class GroupOwnershipGuard implements CanActivate {
  constructor(private readonly groupService: GroupService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const { groupId, userId } = request.params;

    if (!user?.sub) {
      throw new UnauthorizedException("Authentication required");
    }

    if (!groupId) {
      throw new BadRequestException("Group ID is required");
    }

    if (!isUUID(groupId)) {
      throw new BadRequestException(
        "Validation failed for groupId (uuid is expected)",
      );
    }

    if (userId !== undefined) {
      if (!isUUID(userId)) {
        throw new BadRequestException(
          "Validation failed for userId (uuid is expected)",
        );
      }
    }

    await this.groupService.checkOwnership(groupId, user.sub);

    return true;
  }
}
