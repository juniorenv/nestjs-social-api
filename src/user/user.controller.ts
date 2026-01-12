import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { ProfileEntity } from "./dto/user.types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";
import { UserDetailResponseDto } from "./dto/user-detail-response.dto";
import {
  ApiConflictErrorResponse,
  ApiDatabaseExceptionResponses,
  ApiForbiddenErrorResponse,
  ApiInvalidUUIDResponse,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from "src/common/decorators/swagger/api-error-responses.decorator";
import { ProfileResponseDto } from "./dto/profile-response.dto";
import {
  SWAGGER_EXAMPLES,
  generatePathExample,
} from "src/common/constants/swagger-examples.constants";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { OwnershipGuard } from "src/common/guards/ownership.guard";

@Controller("users")
@ApiTags("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":userId")
  @ApiOperation({
    summary: "Get user by ID",
    description:
      "Retrieves detailed user information including profile, posts, and groups. This endpoint is public and does not require authentication.",
  })
  @ApiParam({
    name: "userId",
    format: "uuid",
    description: "User unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "User found successfully",
    type: UserDetailResponseDto,
  })
  @ApiNotFoundErrorResponse(
    "User",
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  @ApiInvalidUUIDResponse("/users/invalid-uuid")
  @ApiDatabaseExceptionResponses(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  public async findOne(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.userService.findOne(userId);
  }

  @Post()
  @ApiOperation({
    summary: "Create a new user",
    description:
      "Creates a new user account with a hashed password. Email must be unique. This endpoint is public for user registration.",
  })
  @ApiResponse({
    status: 201,
    description: "User created successfully",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
    schema: {
      example: {
        statusCode: 400,
        timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
        path: "/users",
        message: {
          message: [
            "name must be between 2 and 32 characters",
            "name must be a string",
            "invalid email format",
            "Password must be between 8 and 50 characters",
            "password must be a string",
          ],
          error: "Bad Request",
        },
      },
    },
  })
  @ApiConflictErrorResponse("Email already in use", "/users")
  @ApiDatabaseExceptionResponses("/users")
  public async create(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(user);
  }

  @Delete(":userId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, OwnershipGuard)
  @ApiOperation({
    summary: "Delete a user",
    description:
      "Permanently deletes a user account and all associated data (posts, comments, profile). Requires authentication. This action cannot be undone.",
  })
  @ApiParam({
    name: "userId",
    format: "uuid",
    description: "User unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "User deleted successfully",
    type: UserResponseDto,
  })
  @ApiForbiddenErrorResponse(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  @ApiNotFoundErrorResponse(
    "User",
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  @ApiInvalidUUIDResponse("/users/invalid-uuid")
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  public async delete(
    @Param("userId", ParseUUIDPipe) userId: string,
  ): Promise<UserResponseDto> {
    return this.userService.delete(userId);
  }

  @Patch(":userId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, OwnershipGuard)
  @ApiOperation({
    summary: "Update user information",
    description:
      "Updates the user's name and/or email. At least one field must be provided. If updating the email, it must be unique. Requires authentication.",
  })
  @ApiParam({
    name: "userId",
    format: "uuid",
    description: "User unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: UserResponseDto,
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
              path: "/users/invalid-uuid",
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
              path: generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
              message: {
                message: [
                  "name must be between 2 and 32 characters",
                  "name must be a string",
                  "invalid email format",
                  "At least one property must be provided for update: name, email",
                ],
                error: "Bad Request",
              },
            },
          },
        },
      },
    },
  })
  @ApiForbiddenErrorResponse(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  @ApiNotFoundErrorResponse(
    "User",
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  @ApiConflictErrorResponse(
    "Email already in use",
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID),
  )
  public async update(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(userId, updateUserDto);
  }

  @Put(":userId/password")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, OwnershipGuard)
  @ApiOperation({
    summary: "Change user password",
    description:
      "Updates the user's password. Requires current password verification. The new password must be different from the current one and meet the minimum security requirements (8-50 characters). Requires authentication.",
  })
  @ApiParam({
    name: "userId",
    format: "uuid",
    description: "User unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Password changed successfully",
    schema: {
      example: {
        message: "Password changed successfully",
      },
    },
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
              path: "/users/invalid-uuid/password",
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
              path: generatePathExample(
                "/users",
                SWAGGER_EXAMPLES.USER_ID,
                "password",
              ),
              message: {
                message: [
                  "currentPassword must be longer than or equal to 8 characters",
                  "currentPassword must be shorter than or equal to 50 characters",
                  "currentPassword must be a string",
                  "newPassword must be longer than or equal to 8 characters",
                  "newPassword must be shorter than or equal to 50 characters",
                  "newPassword must be a string",
                ],
                error: "Bad Request",
              },
            },
          },
          samePassword: {
            summary: "Same Password Error",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/users",
                SWAGGER_EXAMPLES.USER_ID,
                "password",
              ),
              message: {
                message: "New password must be different from current password",
                error: "Bad Request",
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "password"),
    {
      wrongPassword: {
        summary: "Wrong Current Password",
        description: "The provided current password is incorrect",
        value: {
          statusCode: 401,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: generatePathExample(
            "/users",
            SWAGGER_EXAMPLES.USER_ID,
            "password",
          ),
          message: {
            message: "Current password is incorrect",
            error: "Unauthorized",
          },
        },
      },
    },
  )
  @ApiForbiddenErrorResponse(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "password"),
  )
  @ApiNotFoundErrorResponse(
    "User",
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "password"),
  )
  @ApiInvalidUUIDResponse("/users/invalid-uuid/password")
  @ApiDatabaseExceptionResponses(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "password"),
  )
  public async changePassword(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post(":userId/profile")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, OwnershipGuard)
  @ApiOperation({
    summary: "Create user profile",
    description:
      "Creates a new profile for the user with metadata including bio, avatar, social links, preferences, and more. A user can only have one profile. Requires authentication.",
  })
  @ApiParam({
    name: "userId",
    format: "uuid",
    description: "User unique identifier (UUID)",
  })
  @ApiResponse({
    status: 201,
    description: "Profile created successfully",
    type: ProfileResponseDto,
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
              path: "/users/invalid-uuid/profile",
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
              path: generatePathExample(
                "/users",
                SWAGGER_EXAMPLES.USER_ID,
                "profile",
              ),
              message: {
                message: [
                  "metadata must be an object",
                  "metadata.bio must be longer than or equal to 1 characters",
                  "metadata.bio must be a string",
                  "metadata.avatar must be a valid URL",
                  "metadata.phone number must be in international format with 7-15 digits (e.g. +5577996483728)",
                  "metadata.phone must be a string",
                  "metadata.location must be longer than or equal to 1 characters",
                  "metadata.location must be a string",
                  "metadata.website must be a valid URL",
                  "metadata.preferences must be an object",
                ],
                error: "Bad Request",
              },
            },
          },
        },
      },
    },
  })
  @ApiForbiddenErrorResponse(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "profile"),
  )
  @ApiNotFoundErrorResponse(
    "User",
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "profile"),
  )
  @ApiConflictErrorResponse(
    "This user already has a profile",
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "profile"),
  )
  @ApiInvalidUUIDResponse("/users/invalid-uuid/profile")
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "profile"),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "profile"),
  )
  public async createProfileInfo(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() profileInfo: CreateProfileDto,
  ): Promise<ProfileEntity> {
    return this.userService.createProfileInfo(userId, profileInfo);
  }

  @Patch(":userId/profile")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, OwnershipGuard)
  @ApiOperation({
    summary: "Update user profile",
    description:
      "Updates user profile metadata. Performs deep merge of nested objects (preferences, social links). Only provided fields will be updated. Requires authentication.",
  })
  @ApiParam({
    name: "userId",
    format: "uuid",
    description: "User unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Profile updated successfully",
    type: ProfileResponseDto,
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
              path: "/users/invalid-uuid/profile",
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
              path: generatePathExample(
                "/users",
                SWAGGER_EXAMPLES.USER_ID,
                "profile",
              ),
              message: {
                message: [
                  "metadata must be an object",
                  "metadata cannot be null",
                  "preferences cannot be null",
                  "socialLinks cannot be null",
                  "At least one property must be provided for update: metadata",
                ],
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
                "/users",
                SWAGGER_EXAMPLES.USER_ID,
                "profile",
              ),
              message: {
                message: `User with ID ${SWAGGER_EXAMPLES.USER_ID} not found`,
                error: "Not Found",
              },
            },
          },
          profileNotFound: {
            summary: "Profile Not Found",
            value: {
              statusCode: 404,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: generatePathExample(
                "/users",
                SWAGGER_EXAMPLES.USER_ID,
                "profile",
              ),
              message: {
                message: "This user does not have a profile yet",
                error: "Not Found",
              },
            },
          },
        },
      },
    },
  })
  @ApiForbiddenErrorResponse(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "profile"),
  )
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "profile"),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/users", SWAGGER_EXAMPLES.USER_ID, "profile"),
  )
  public async updateProfileInfo(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileEntity> {
    return this.userService.updateProfileInfo(userId, updateProfileDto);
  }
}
