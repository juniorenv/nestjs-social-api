import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  ParseUUIDPipe,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { GroupService } from "./group.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { GroupEntity } from "./dto/group.types";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { GroupDetailResponseDto } from "./dto/group-detail-response.dto";
import {
  ApiDatabaseExceptionResponses,
  ApiInvalidUUIDResponse,
  ApiNotFoundErrorResponse,
  ApiConflictErrorResponse,
  ApiUnauthorizedErrorResponse,
  ApiForbiddenErrorResponse,
} from "src/common/decorators/swagger/api-error-responses.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { GroupResponseDto } from "./dto/group-response.dto";
import {
  SWAGGER_EXAMPLES,
  generatePathExample,
} from "src/common/constants/swagger-examples.constants";
import type { Request } from "express";
import { GroupOwnershipGuard } from "src/common/guards/group-ownership.guard";

@Controller("groups")
@ApiTags("groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get(":groupId")
  @ApiOperation({
    summary: "Get group by ID",
    description:
      "Retrieves detailed group information including creator and all members with their roles. This endpoint is public and does not require authentication.",
  })
  @ApiParam({
    name: "groupId",
    format: "uuid",
    description: "Group unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Group found successfully",
    type: GroupDetailResponseDto,
  })
  @ApiNotFoundErrorResponse(
    "Group",
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  @ApiInvalidUUIDResponse("/groups/invalid-uuid")
  @ApiDatabaseExceptionResponses(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  public async findOne(@Param("groupId", ParseUUIDPipe) groupId: string) {
    return this.groupService.findOne(groupId);
  }

  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Create a new group",
    description:
      "Creates a new group with the authenticated user as the owner. Group name must be unique. Requires authentication.",
  })
  @ApiResponse({
    status: 201,
    description: "Group created successfully",
    type: GroupResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
    content: {
      "application/json": {
        example: {
          statusCode: 400,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: "/groups",
          message: {
            message: [
              "name must be longer than or equal to 2 characters",
              "name must be shorter than or equal to 25 characters",
              "name must be a string",
              "description must be shorter than or equal to 500 characters",
              "description must be a string",
            ],
            error: "Bad Request",
          },
        },
      },
    },
  })
  @ApiNotFoundErrorResponse("User", "/groups")
  @ApiConflictErrorResponse(`Group name already exists`, "/groups")
  @ApiUnauthorizedErrorResponse("/groups")
  @ApiDatabaseExceptionResponses("/groups")
  public async create(
    @Body() createGroupDto: CreateGroupDto,
    @Req() request: Request,
  ) {
    const createdById = request.user!.sub;
    return this.groupService.create(createdById, createGroupDto);
  }

  @Delete(":groupId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, GroupOwnershipGuard)
  @ApiOperation({
    summary: "Delete group",
    description:
      "Permanently deletes a group and all memberships. Only the group owner can delete the group. Requires authentication. This action cannot be undone.",
  })
  @ApiParam({
    name: "groupId",
    format: "uuid",
    description: "Group unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Group deleted successfully",
    type: GroupResponseDto,
  })
  @ApiNotFoundErrorResponse(
    "Group",
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  @ApiInvalidUUIDResponse("/groups/invalid-uuid")
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  @ApiForbiddenErrorResponse()
  @ApiDatabaseExceptionResponses(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  public async delete(
    @Param("groupId", ParseUUIDPipe) groupId: string,
  ): Promise<GroupEntity> {
    return this.groupService.delete(groupId);
  }

  @Patch(":groupId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, GroupOwnershipGuard)
  @ApiOperation({
    summary: "Update group",
    description:
      "Updates group name and/or description. Only the group owner can update the group. Requires authentication.",
  })
  @ApiParam({
    name: "groupId",
    format: "uuid",
    description: "Group unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Group updated successfully",
    type: GroupResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
    content: {
      "application/json": {
        examples: {
          invalidUuid: {
            summary: "Invalid UUID",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: "/groups/invalid-uuid",
              message: {
                message: "Validation failed (uuid is expected)",
                error: "Bad Request",
              },
            },
          },
          formValidation: {
            summary: "Form Validation Error",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
              message: {
                message: [
                  "At least one property must be provided for update: name, description",
                  "name must be longer than or equal to 2 characters",
                  "name must be shorter than or equal to 25 characters",
                  "name must be a string",
                  "description must be shorter than or equal to 500 characters",
                  "description must be a string",
                ],
                error: "Bad Request",
              },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundErrorResponse(
    "Group",
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  @ApiConflictErrorResponse(
    `Group name already exists`,
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  @ApiForbiddenErrorResponse()
  @ApiDatabaseExceptionResponses(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  public async update(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupEntity> {
    return this.groupService.update(groupId, updateGroupDto);
  }

  @Post(":groupId/join")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Join group",
    description:
      "Join a group as a member. User will be added with 'member' role. Requires authentication.",
  })
  @ApiParam({
    name: "groupId",
    format: "uuid",
    description: "Group unique identifier (UUID)",
  })
  @ApiResponse({
    status: 201,
    description: "Successfully joined group",
    schema: {
      example: {
        userId: SWAGGER_EXAMPLES.USER_ID,
        groupId: SWAGGER_EXAMPLES.GROUP_ID,
        role: "member",
        joinedAt: SWAGGER_EXAMPLES.TIMESTAMP,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not Found",
    content: {
      "application/json": {
        examples: {
          groupNotFound: {
            summary: "Group Not Found",
            value: {
              statusCode: 404,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "join",
              ),
              message: {
                message: `Group with ID ${SWAGGER_EXAMPLES.GROUP_ID} not found`,
                error: "Not Found",
              },
            },
          },
          userNotFound: {
            summary: "User Not Found",
            value: {
              statusCode: 404,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "join",
              ),
              message: {
                message: `User with ID ${SWAGGER_EXAMPLES.USER_ID} not found`,
                error: "Not Found",
              },
            },
          },
        },
      },
    },
  })
  @ApiInvalidUUIDResponse("/groups/invalid-uuid/join")
  @ApiConflictErrorResponse(
    `User ${SWAGGER_EXAMPLES.USER_ID} is already a member of this group`,
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID, "join"),
  )
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID, "join"),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID, "join"),
  )
  public async joinGroup(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Req() request: Request,
  ) {
    const userId = request.user!.sub;
    return this.groupService.joinGroup(groupId, userId);
  }

  @Delete(":groupId/leave")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Leave group",
    description:
      "Leave a group. Group owner cannot leave (must transfer ownership or delete group). Requires authentication.",
  })
  @ApiParam({
    name: "groupId",
    format: "uuid",
    description: "Group unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Successfully left group",
    schema: {
      example: {
        message: `Member ${SWAGGER_EXAMPLES.USER_ID} has successfully left the group`,
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Owner cannot leave",
    content: {
      "application/json": {
        example: {
          statusCode: 403,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: generatePathExample(
            "/groups",
            SWAGGER_EXAMPLES.GROUP_ID,
            "leave",
          ),
          message: {
            message:
              "Group owner cannot leave. Transfer ownership or delete the group",
            error: "Forbidden",
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not Found",
    content: {
      "application/json": {
        example: {
          statusCode: 404,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: generatePathExample(
            "/groups",
            SWAGGER_EXAMPLES.GROUP_ID,
            "leave",
          ),
          message: {
            message: `User ${SWAGGER_EXAMPLES.USER_ID} is not a member of this group`,
            error: "Not Found",
          },
        },
      },
    },
  })
  @ApiInvalidUUIDResponse("/groups/invalid-uuid/leave")
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID, "leave"),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID, "leave"),
  )
  public async leaveGroup(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Req() request: Request,
  ) {
    const userId = request.user!.sub;
    return this.groupService.leaveGroup(groupId, userId);
  }

  @Delete(":groupId/members/:userId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, GroupOwnershipGuard)
  @ApiOperation({
    summary: "Remove member from group",
    description:
      "Remove a member from the group. Only the group owner can remove members. Cannot remove the owner. Requires authentication.",
  })
  @ApiParam({
    name: "groupId",
    format: "uuid",
    description: "Group unique identifier (UUID)",
  })
  @ApiParam({
    name: "userId",
    format: "uuid",
    description: "User unique identifier (UUID) to remove",
  })
  @ApiResponse({
    status: 200,
    description: "Member removed successfully",
    schema: {
      example: {
        message: `Member ${SWAGGER_EXAMPLES.USER_ID} has been successfully removed`,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Invalid UUID format",
    content: {
      "application/json": {
        examples: {
          invalidGroupId: {
            summary: "Invalid Group ID",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: "/groups/invalid-uuid/members/" + SWAGGER_EXAMPLES.USER_ID,
              message: {
                message: "Validation failed for groupId (uuid is expected)",
                error: "Bad Request",
              },
            },
          },
          invalidUserId: {
            summary: "Invalid User ID",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "members",
                "invalid-uuid",
              ),
              message: {
                message: "Validation failed for userId (uuid is expected)",
                error: "Bad Request",
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: "Forbidden - Cannot remove owner or not authorized",
    content: {
      "application/json": {
        examples: {
          cannotRemoveOwner: {
            summary: "Cannot Remove Owner",
            value: {
              statusCode: 403,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "members",
                SWAGGER_EXAMPLES.USER_ID,
              ),
              message: {
                message: "Cannot remove the group owner",
                error: "Forbidden",
              },
            },
          },
          notOwner: {
            summary: "Not Group Owner",
            value: {
              statusCode: 403,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "members",
                SWAGGER_EXAMPLES.USER_ID,
              ),
              message: {
                message: "Only the group owner can perform this action",
                error: "Forbidden",
              },
            },
          },
          notAMember: {
            summary: "User Not a Member",
            value: {
              statusCode: 403,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "members",
                SWAGGER_EXAMPLES.USER_ID,
              ),
              message: {
                message: "You are not a member of this group",
                error: "Forbidden",
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not Found",
    content: {
      "application/json": {
        example: {
          statusCode: 404,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: generatePathExample(
            "/groups",
            SWAGGER_EXAMPLES.GROUP_ID,
            "members",
            SWAGGER_EXAMPLES.USER_ID,
          ),
          message: {
            message: `User ${SWAGGER_EXAMPLES.USER_ID} is not a member of this group`,
            error: "Not Found",
          },
        },
      },
    },
  })
  @ApiUnauthorizedErrorResponse(
    generatePathExample(
      "/groups",
      SWAGGER_EXAMPLES.GROUP_ID,
      "members",
      SWAGGER_EXAMPLES.USER_ID,
    ),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample(
      "/groups",
      SWAGGER_EXAMPLES.GROUP_ID,
      "members",
      SWAGGER_EXAMPLES.USER_ID,
    ),
  )
  public async removeMember(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
  ) {
    return this.groupService.removeMember(groupId, userId);
  }
}
