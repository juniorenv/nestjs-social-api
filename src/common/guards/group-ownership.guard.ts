import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { GroupService } from "src/group/group.service";

/**
 * Guard to check if authenticated user is the group owner
 */
@Injectable()
export class GroupOwnershipGuard implements CanActivate {
  constructor(private readonly groupService: GroupService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const groupId = request.params.groupId;

    if (!user?.sub || !groupId) {
      return false;
    }

    await this.groupService.checkOwnership(groupId, user.sub);

    return true;
  }
}
