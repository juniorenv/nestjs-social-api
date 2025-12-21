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
} from "@nestjs/common";
import { GroupService } from "./group.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { GroupEntity } from "./dto/group.types";
import { AddMemberDto } from "./dto/add-member.dto";
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
} from "src/common/decorators/swagger/api-error-responses.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { GroupResponseDto } from "./dto/group-response.dto";
import { MemberOperationResponseDto } from "./dto/member-operation-response.dto";
import {
  SWAGGER_EXAMPLES,
  generatePathExample,
} from "src/common/constants/swagger-examples.constants";

@Controller("groups")
@ApiTags("groups")
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get(":groupId")
  @ApiOperation({
    summary: "Get group by ID",
    description:
      "Retrieves detailed group information including all members. Returns group details with a list of users who belong to this group. This endpoint is public and does not require authentication.",
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
      "Creates a new group with a unique name. Group names must be between 1-10 characters and cannot duplicate existing groups. Requires authentication.",
  })
  @ApiResponse({
    status: 201,
    description: "Group created successfully",
    type: GroupResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
    schema: {
      example: {
        statusCode: 400,
        timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
        path: "/groups",
        message: {
          message: [
            "name must be longer than or equal to 1 characters",
            "name must be shorter than or equal to 10 characters",
            "name must be a string",
          ],
          error: "Bad Request",
        },
      },
    },
  })
  @ApiConflictErrorResponse(
    `Group ${SWAGGER_EXAMPLES.GROUP_NAME_TYPESCRIPT} already exists`,
    "/groups",
  )
  @ApiUnauthorizedErrorResponse("/groups")
  @ApiDatabaseExceptionResponses("/groups")
  public async create(@Body() group: CreateGroupDto): Promise<GroupEntity> {
    return this.groupService.create(group);
  }

  @Delete(":groupId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Delete a group",
    description:
      "Permanently deletes a group and all its member associations. This will remove all users from the group but will not delete the users themselves. Requires authentication. This action cannot be undone.",
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
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Update group information",
    description:
      "Updates the group's name. The new name must be unique across all groups. Requires authentication.",
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
                  "name must be longer than or equal to 1 characters",
                  "name must be shorter than or equal to 10 characters",
                  "name must be a string",
                  "At least one property must be provided for update: name",
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
    `Group ${SWAGGER_EXAMPLES.GROUP_NAME_RUST} already exists`,
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID),
  )
  public async update(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupEntity> {
    return this.groupService.update(groupId, updateGroupDto);
  }

  @Post(":groupId/members")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Add member to group",
    description:
      "Adds an existing user to the specified group. Both the user and group must exist. A user cannot be added to the same group twice. Requires authentication.",
  })
  @ApiParam({
    name: "groupId",
    format: "uuid",
    description: "Group unique identifier (UUID)",
  })
  @ApiResponse({
    status: 201,
    description: "Member added successfully",
    type: MemberOperationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
    content: {
      "application/json": {
        examples: {
          invalidGroupUuid: {
            summary: "Invalid Group UUID",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: "/groups/invalid-uuid/members",
              message: {
                message: "Validation failed (uuid is expected)",
                error: "Bad Request",
              },
            },
          },
          invalidUserUuid: {
            summary: "Invalid User UUID in Body",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "members",
              ),
              message: {
                message: ["userId must be a UUID"],
                error: "Bad Request",
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
        examples: {
          groupNotFound: {
            summary: "Group Not Found",
            value: {
              statusCode: 404,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "members",
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
                "members",
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
  @ApiConflictErrorResponse(
    `User ${SWAGGER_EXAMPLES.USER_ID} is already a member of this group`,
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID, "members"),
  )
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID, "members"),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/groups", SWAGGER_EXAMPLES.GROUP_ID, "members"),
  )
  public async addMember(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Body() addMemberDto: AddMemberDto,
  ): Promise<{ message: string }> {
    return this.groupService.addMember(groupId, addMemberDto.userId);
  }

  @Delete(":groupId/members/:userId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Remove member from group",
    description:
      "Removes a user from the specified group. The user must be a current member of the group. This only removes the association; the user account remains intact. Requires authentication.",
  })
  @ApiParam({
    name: "groupId",
    format: "uuid",
    description: "Group unique identifier (UUID)",
  })
  @ApiParam({
    name: "userId",
    format: "uuid",
    description: "User unique identifier (UUID)",
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
          invalidGroupUuid: {
            summary: "Invalid Group UUID",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups/invalid-uuid/members",
                SWAGGER_EXAMPLES.USER_ID,
              ),
              message: {
                message: "Validation failed (uuid is expected)",
                error: "Bad Request",
              },
            },
          },
          invalidUserUuid: {
            summary: "Invalid User UUID",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "members/invalid-uuid",
              ),
              message: {
                message: "Validation failed (uuid is expected)",
                error: "Bad Request",
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
        examples: {
          userNotFound: {
            summary: "User Not Found",
            value: {
              statusCode: 404,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "members",
                SWAGGER_EXAMPLES.USER_ID,
              ),
              message: {
                message: `User with ID ${SWAGGER_EXAMPLES.USER_ID} not found`,
                error: "Not Found",
              },
            },
          },
          membershipNotFound: {
            summary: "User Not a Member",
            value: {
              statusCode: 404,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/groups",
                SWAGGER_EXAMPLES.GROUP_ID,
                "members",
                SWAGGER_EXAMPLES.USER_ID,
              ),
              message: {
                message: `User ${SWAGGER_EXAMPLES.USER_ID} is not a member from this group`,
                error: "Not Found",
              },
            },
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
  async removeMember(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
  ): Promise<{ message: string }> {
    return this.groupService.removeMember(groupId, userId);
  }
}
