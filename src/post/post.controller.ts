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
  Req,
} from "@nestjs/common";
import { PostService } from "./post.service";
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
import { SWAGGER_EXAMPLES } from "src/common/constants/swagger-examples.constants";
import { AuthGuard } from "src/auth/auth.guard";
import { PostResponseDto } from "./dto/post-response.dto";
import { ResourceOwnershipGuard } from "src/common/guards/resource-ownership.guard";
import { ResourceType } from "src/common/decorators/resource-type.decorator";
import type { Request } from "express";
import { CommentResponseDto } from "src/comment/dto/comment-response.dto";
import { CreateCommentDto } from "src/comment/dto/create-comment.dto";
import { CommentService } from "src/comment/comment.service";

@Controller("posts")
@ApiTags("posts")
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Create a new post",
    description:
      "Creates a new post authored by the authenticated user. Title must be between 5-100 characters and content between 1-280 characters. Requires authentication.",
  })
  @ApiResponse({
    status: 201,
    description: "Post created successfully",
    type: PostResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Validation error",
    content: {
      "application/json": {
        example: {
          statusCode: 400,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: "/posts",
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
  })
  @ApiNotFoundErrorResponse("User", "/posts")
  @ApiUnauthorizedErrorResponse("/posts")
  @ApiDatabaseExceptionResponses("/posts")
  public async create(
    @Body() post: CreatePostDto,
    @Req() request: Request,
  ): Promise<PostResponseDto> {
    const authorId = request.user!.sub;
    return this.postService.create(authorId, post);
  }

  @Delete(":postId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, ResourceOwnershipGuard)
  @ResourceType("post")
  @ApiOperation({
    summary: "Delete a post",
    description:
      "Permanently deletes a post and all associated comments. This action cascades to remove all comments on the post. Only the post author can delete the post. Requires authentication. This action cannot be undone.",
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
  @ApiResponse({
    status: 403,
    description: "Forbidden - Not the post author",
    content: {
      "application/json": {
        example: {
          statusCode: 403,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: "/posts/" + SWAGGER_EXAMPLES.POST_ID,
          message: {
            message: "You can only modify your own posts",
            error: "Forbidden",
          },
        },
      },
    },
  })
  @ApiNotFoundErrorResponse("Post", "/posts/" + SWAGGER_EXAMPLES.POST_ID)
  @ApiInvalidUUIDResponse("/posts/invalid-uuid")
  @ApiUnauthorizedErrorResponse("/posts/" + SWAGGER_EXAMPLES.POST_ID)
  @ApiDatabaseExceptionResponses("/posts/" + SWAGGER_EXAMPLES.POST_ID)
  public async delete(
    @Param("postId", ParseUUIDPipe) postId: string,
  ): Promise<PostResponseDto> {
    return this.postService.delete(postId);
  }

  @Patch(":postId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, ResourceOwnershipGuard)
  @ResourceType("post")
  @ApiOperation({
    summary: "Update post information",
    description:
      "Updates the post's title and/or content. At least one field must be provided. Title must remain between 5-100 characters if updated, and content between 1-280 characters if updated. Only the post author can update the post. Requires authentication.",
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
              path: "/posts/" + SWAGGER_EXAMPLES.POST_ID,
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
  @ApiResponse({
    status: 403,
    description: "Forbidden - Not the post author",
    content: {
      "application/json": {
        example: {
          statusCode: 403,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: "/posts/" + SWAGGER_EXAMPLES.POST_ID,
          message: {
            message: "You can only modify your own posts",
            error: "Forbidden",
          },
        },
      },
    },
  })
  @ApiNotFoundErrorResponse("Post", "/posts/" + SWAGGER_EXAMPLES.POST_ID)
  @ApiUnauthorizedErrorResponse("/posts/" + SWAGGER_EXAMPLES.POST_ID)
  @ApiDatabaseExceptionResponses("/posts/" + SWAGGER_EXAMPLES.POST_ID)
  public async update(
    @Param("postId", ParseUUIDPipe) postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.update(postId, updatePostDto);
  }

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
  @ApiNotFoundErrorResponse("Post", "/posts/" + SWAGGER_EXAMPLES.POST_ID)
  @ApiInvalidUUIDResponse("/posts/invalid-uuid")
  @ApiDatabaseExceptionResponses("/posts/" + SWAGGER_EXAMPLES.POST_ID)
  public async findOne(
    @Param("postId", ParseUUIDPipe) postId: string,
  ): Promise<PostDetailResponseDto> {
    return this.postService.findOne(postId);
  }

  @Post(":postId/comments")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Create a comment on a post",
    description:
      "Creates a new comment on the specified post by the authenticated user. Comment text must be between 1-280 characters. Requires authentication.",
    tags: ["posts", "comments"],
  })
  @ApiParam({
    name: "postId",
    format: "uuid",
    description: "Post unique identifier (UUID)",
  })
  @ApiResponse({
    status: 201,
    description: "Comment created successfully",
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request - Validation error",
    content: {
      "application/json": {
        examples: {
          invalidPostId: {
            summary: "Invalid Post UUID",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: "/posts/invalid-uuid/comments",
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
              path: "/posts/" + SWAGGER_EXAMPLES.POST_ID + "/comments",
              message: {
                message: [
                  "text must be longer than or equal to 1 characters",
                  "text must be shorter than or equal to 280 characters",
                  "text must be a string",
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
            summary: "Author Not Found",
            value: {
              statusCode: 404,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: "/posts/" + SWAGGER_EXAMPLES.POST_ID + "/comments",
              message: {
                message: `User with ID ${SWAGGER_EXAMPLES.USER_ID} not found`,
                error: "Not Found",
              },
            },
          },
          postNotFound: {
            summary: "Post Not Found",
            value: {
              statusCode: 404,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: "/posts/" + SWAGGER_EXAMPLES.POST_ID + "/comments",
              message: {
                message: `Post with ID ${SWAGGER_EXAMPLES.POST_ID} not found`,
                error: "Not Found",
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedErrorResponse(
    "/posts/" + SWAGGER_EXAMPLES.POST_ID + "/comments",
  )
  @ApiDatabaseExceptionResponses(
    "/posts/" + SWAGGER_EXAMPLES.POST_ID + "/comments",
  )
  public async createComment(
    @Param("postId", ParseUUIDPipe) postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() request: Request,
  ) {
    const authorId = request.user!.sub;
    return this.commentService.create(authorId, postId, createCommentDto);
  }
}
