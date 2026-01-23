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
  Req,
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
  ApiInvalidUUIDResponse,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from "src/common/decorators/swagger/api-error-responses.decorator";
import { ProfileResponseDto } from "./dto/profile-response.dto";
import { SWAGGER_EXAMPLES } from "src/common/constants/swagger-examples.constants";
import { ChangePasswordDto } from "./dto/change-password.dto";
import type { Request } from "express";

@Controller("users")
@ApiTags("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("me")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Get current user profile",
    description:
      "Retrieves the authenticated user's detailed information including profile, posts, and groups. Requires authentication.",
  })
  @ApiResponse({
    status: 200,
    description: "Current user profile retrieved successfully",
    type: UserDetailResponseDto,
  })
  @ApiNotFoundErrorResponse("User", "/users/me")
  @ApiUnauthorizedErrorResponse("/users/me")
  @ApiDatabaseExceptionResponses("/users/me")
  public async findMe(@Req() request: Request) {
    const userId = request.user!.sub;
    return this.userService.findOne(userId);
  }

  @Patch("me")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Update current user information",
    description:
      "Updates the authenticated user's name and/or email. At least one field must be provided. If updating the email, it must be unique. Requires authentication.",
  })
  @ApiResponse({
    status: 200,
    description: "User updated successfully",
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Validation error",
    content: {
      "application/json": {
        example: {
          statusCode: 400,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: "/users/me",
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
  })
  @ApiNotFoundErrorResponse("User", "/users/me")
  @ApiConflictErrorResponse("Email already in use", "/users/me")
  @ApiUnauthorizedErrorResponse("/users/me")
  @ApiDatabaseExceptionResponses("/users/me")
  public async update(
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ): Promise<UserResponseDto> {
    const userId = request.user!.sub;
    return this.userService.update(userId, updateUserDto);
  }

  @Delete("me")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Delete current user account",
    description:
      "Permanently deletes the authenticated user's account and all associated data (posts, comments, profile). Requires authentication. This action cannot be undone.",
  })
  @ApiResponse({
    status: 200,
    description: "User deleted successfully",
    type: UserResponseDto,
  })
  @ApiNotFoundErrorResponse("User", "/users/me")
  @ApiUnauthorizedErrorResponse("/users/me")
  @ApiDatabaseExceptionResponses("/users/me")
  public async delete(@Req() request: Request): Promise<UserResponseDto> {
    const userId = request.user!.sub;
    return this.userService.delete(userId);
  }

  @Put("me/password")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Change current user password",
    description:
      "Updates the authenticated user's password. Requires current password verification. The new password must be different from the current one and meet the minimum security requirements (8-50 characters). Requires authentication.",
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
    description: "Bad Request - Validation or password error",
    content: {
      "application/json": {
        examples: {
          formValidation: {
            summary: "Form Validation Error",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: "/users/me/password",
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
              path: "/users/me/password",
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
  @ApiUnauthorizedErrorResponse("/users/me/password", {
    wrongPassword: {
      summary: "Wrong Current Password",
      description: "The provided current password is incorrect",
      value: {
        statusCode: 401,
        timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
        path: "/users/me/password",
        message: {
          message: "Current password is incorrect",
          error: "Unauthorized",
        },
      },
    },
  })
  @ApiNotFoundErrorResponse("User", "/users/me/password")
  @ApiDatabaseExceptionResponses("/users/me/password")
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() request: Request,
  ) {
    const userId = request.user!.sub;
    return this.userService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post("me/profile")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Create current user profile",
    description:
      "Creates a new profile for the authenticated user with metadata including bio, avatar, social links, preferences, and more. A user can only have one profile. Requires authentication.",
  })
  @ApiResponse({
    status: 201,
    description: "Profile created successfully",
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Validation error",
    content: {
      "application/json": {
        example: {
          statusCode: 400,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: "/users/me/profile",
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
  })
  @ApiNotFoundErrorResponse("User", "/users/me/profile")
  @ApiConflictErrorResponse(
    "This user already has a profile",
    "/users/me/profile",
  )
  @ApiUnauthorizedErrorResponse("/users/me/profile")
  @ApiDatabaseExceptionResponses("/users/me/profile")
  public async createProfileInfo(
    @Body() profileInfo: CreateProfileDto,
    @Req() request: Request,
  ): Promise<ProfileEntity> {
    const userId = request.user!.sub;
    return this.userService.createProfileInfo(userId, profileInfo);
  }

  @Patch("me/profile")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Update current user profile",
    description:
      "Updates the authenticated user's profile metadata. Performs deep merge of nested objects (preferences, social links). Only provided fields will be updated. Requires authentication.",
  })
  @ApiResponse({
    status: 200,
    description: "Profile updated successfully",
    type: ProfileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Validation error",
    content: {
      "application/json": {
        example: {
          statusCode: 400,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: "/users/me/profile",
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
              path: "/users/me/profile",
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
              path: "/users/me/profile",
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
  @ApiUnauthorizedErrorResponse("/users/me/profile")
  @ApiDatabaseExceptionResponses("/users/me/profile")
  public async updateProfileInfo(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() request: Request,
  ): Promise<ProfileEntity> {
    const userId = request.user!.sub;
    return this.userService.updateProfileInfo(userId, updateProfileDto);
  }

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
  @ApiNotFoundErrorResponse("User", "/users/" + SWAGGER_EXAMPLES.USER_ID)
  @ApiInvalidUUIDResponse("/users/invalid-uuid")
  @ApiDatabaseExceptionResponses("/users/" + SWAGGER_EXAMPLES.USER_ID)
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
            "password must be between 8 and 50 characters",
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
}
