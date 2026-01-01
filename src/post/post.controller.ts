import {
  Post,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { PostEntity } from "./dto/post.types";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PostDetailResponseDto } from "./dto/post-detail-response.dto";
import {
  ApiDatabaseExceptionResponses,
  ApiInvalidUUIDResponse,
  ApiNotFoundErrorResponse,
  ApiUnauthorizedErrorResponse,
} from "src/common/decorators/swagger/api-error-responses.decorator";
import {
  generatePathExample,
  SWAGGER_EXAMPLES,
} from "src/common/constants/swagger-examples.constants";
import { AuthGuard } from "src/auth/auth.guard";
import { PostResponseDto } from "./dto/post-response.dto";
import { OwnershipGuard } from "src/common/guards/ownership.guard";
import { ResourceOwnershipGuard } from "src/common/guards/resource-ownership.guard";
import { ResourceType } from "src/common/decorators/resource-type.decorator";

@Controller("posts")
@ApiTags("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(":postId")
  @ApiOperation({
    summary: "Get post by ID",
    description:
      "Retrieves detailed post information including author details and all comments with their authors. Returns complete post data with nested relationships. This endpoint is public and does not require authentication.",
  })
  @ApiParam({
    name: "postId",
    format: "uuid",
    description: "Post unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Post found successfully",
    type: PostDetailResponseDto,
  })
  @ApiNotFoundErrorResponse(
    "Post",
    generatePathExample("/posts", SWAGGER_EXAMPLES.POST_ID),
  )
  @ApiInvalidUUIDResponse("/posts/invalid-uuid")
  @ApiDatabaseExceptionResponses(
    generatePathExample("/posts", SWAGGER_EXAMPLES.POST_ID),
  )
  public async findOne(@Param("postId", ParseUUIDPipe) postId: string) {
    return this.postService.findOne(postId);
  }

  @Post(":authorId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, OwnershipGuard)
  @ApiOperation({
    summary: "Create a new post",
    description:
      "Creates a new post authored by the specified user. The author must exist in the system. Title must be between 5-100 characters and content between 1-280 characters. Requires authentication.",
  })
  @ApiParam({
    name: "authorId",
    format: "uuid",
    description: "Author's user ID (must be an existing user)",
  })
  @ApiResponse({
    status: 201,
    description: "Post created successfully",
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
    content: {
      "application/json": {
        examples: {
          invalidAuthorUuid: {
            summary: "Invalid Author UUID",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: "/posts/invalid-uuid",
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
              path: generatePathExample("/posts", SWAGGER_EXAMPLES.USER_ID),
              message: {
                message: [
                  "title must be longer than or equal to 5 characters",
                  "title must be shorter than or equal to 100 characters",
                  "title must be a string",
                  "content must be longer than or equal to 1 characters",
                  "content must be shorter than or equal to 280 characters",
                  "content must be a string",
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
    "User",
    generatePathExample("/posts", SWAGGER_EXAMPLES.USER_ID),
  )
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/posts", SWAGGER_EXAMPLES.USER_ID),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/posts", SWAGGER_EXAMPLES.USER_ID),
  )
  public async create(
    @Param("authorId", ParseUUIDPipe) authorId: string,
    @Body() post: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postService.create(authorId, post);
  }

  @Delete(":postId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, ResourceOwnershipGuard)
  @ResourceType("post")
  @ApiOperation({
    summary: "Delete a post",
    description:
      "Permanently deletes a post and all associated comments. This action cascades to remove all comments on the post. Requires authentication. This action cannot be undone.",
  })
  @ApiParam({
    name: "postId",
    format: "uuid",
    description: "Post unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Post deleted successfully",
    type: PostResponseDto,
  })
  @ApiNotFoundErrorResponse(
    "Post",
    generatePathExample("/posts", SWAGGER_EXAMPLES.POST_ID),
  )
  @ApiInvalidUUIDResponse("/posts/invalid-uuid")
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/posts", SWAGGER_EXAMPLES.POST_ID),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/posts", SWAGGER_EXAMPLES.POST_ID),
  )
  public async delete(
    @Param("postId", ParseUUIDPipe) postId: string,
  ): Promise<PostEntity> {
    return this.postService.delete(postId);
  }

  @Patch(":postId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, ResourceOwnershipGuard)
  @ResourceType("post")
  @ApiOperation({
    summary: "Update post information",
    description:
      "Updates the post's title and/or content. At least one field must be provided. Title must remain between 5-100 characters if updated, and content between 1-280 characters if updated. Requires authentication.",
  })
  @ApiParam({
    name: "postId",
    format: "uuid",
    description: "Post unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Post updated successfully",
    type: PostResponseDto,
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
              path: "/posts/invalid-uuid",
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
              path: generatePathExample("/posts", SWAGGER_EXAMPLES.POST_ID),
              message: {
                message: [
                  "title must be longer than or equal to 5 characters",
                  "title must be shorter than or equal to 100 characters",
                  "title must be a string",
                  "content must be longer than or equal to 1 characters",
                  "content must be shorter than or equal to 280 characters",
                  "content must be a string",
                  "At least one property must be provided for update: title, content",
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
    "Post",
    generatePathExample("/posts", SWAGGER_EXAMPLES.POST_ID),
  )
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/posts", SWAGGER_EXAMPLES.POST_ID),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/posts", SWAGGER_EXAMPLES.POST_ID),
  )
  public async update(
    @Param("postId", ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postService.update(postId, updatePostDto);
  }
}
