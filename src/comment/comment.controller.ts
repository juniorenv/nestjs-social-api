import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CommentEntity } from "./dto/comment.types";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CommentDetailResponseDto } from "./dto/comment-detail-response.dto";
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
import { CommentResponseDto } from "./dto/comment-response.dto";

@Controller("comments")
@ApiTags("comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(":commentId")
  @ApiOperation({
    summary: "Get comment by ID",
    description:
      "Retrieves detailed comment information including author details and the post it belongs to. Returns complete comment data with nested author and post information. This endpoint is public and does not require authentication.",
  })
  @ApiParam({
    name: "commentId",
    format: "uuid",
    description: "Comment unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Comment found successfully",
    type: CommentDetailResponseDto,
  })
  @ApiNotFoundErrorResponse(
    "Comment",
    generatePathExample("/comments", SWAGGER_EXAMPLES.COMMENT_ID),
  )
  @ApiInvalidUUIDResponse("/comments/invalid-uuid")
  @ApiDatabaseExceptionResponses(
    generatePathExample("/comments", SWAGGER_EXAMPLES.COMMENT_ID),
  )
  public async findOne(@Param("commentId", ParseUUIDPipe) commentId: string) {
    return this.commentService.findOne(commentId);
  }

  @Post()
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Create a new comment",
    description:
      "Creates a new comment on a post. Both the author (user) and the post must exist in the system. Comment text must be between 1-280 characters. Requires authentication.",
  })
  @ApiResponse({
    status: 201,
    description: "Comment created successfully",
    type: CommentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request",
    content: {
      "application/json": {
        examples: {
          formValidation: {
            summary: "Form Validation Error",
            value: {
              statusCode: 400,
              timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
              path: "/comments",
              message: {
                message: [
                  "authorId must be a UUID",
                  "postId must be a UUID",
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
              path: "/comments",
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
              path: "/comments",
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
  @ApiUnauthorizedErrorResponse("/comments")
  @ApiDatabaseExceptionResponses("/comments")
  public async create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.create(createCommentDto);
  }

  @Delete(":commentId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Delete a comment",
    description:
      "Permanently deletes a comment. The comment will be removed from the database and cannot be recovered. Requires authentication. This action cannot be undone.",
  })
  @ApiParam({
    name: "commentId",
    format: "uuid",
    description: "Comment unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Comment deleted successfully",
    type: CommentResponseDto,
  })
  @ApiNotFoundErrorResponse(
    "Comment",
    generatePathExample("/comments", SWAGGER_EXAMPLES.COMMENT_ID),
  )
  @ApiInvalidUUIDResponse("/comments/invalid-uuid")
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/comments", SWAGGER_EXAMPLES.COMMENT_ID),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/comments", SWAGGER_EXAMPLES.COMMENT_ID),
  )
  public async delete(
    @Param("commentId", ParseUUIDPipe) commentId: string,
  ): Promise<CommentEntity> {
    return this.commentService.delete(commentId);
  }

  @Patch(":commentId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Update comment text",
    description:
      "Updates the comment's text content. The text field is required and must be between 1-280 characters. Only the text can be updated - author and post associations cannot be changed. Requires authentication.",
  })
  @ApiParam({
    name: "commentId",
    format: "uuid",
    description: "Comment unique identifier (UUID)",
  })
  @ApiResponse({
    status: 200,
    description: "Comment updated successfully",
    type: CommentResponseDto,
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
              path: "/comments/invalid-uuid",
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
                "/comments",
                SWAGGER_EXAMPLES.COMMENT_ID,
              ),
              message: {
                message: [
                  "text must be longer than or equal to 1 characters",
                  "text must be shorter than or equal to 280 characters",
                  "text must be a string",
                  "At least one property must be provided for update: text",
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
    "Comment",
    generatePathExample("/comments", SWAGGER_EXAMPLES.COMMENT_ID),
  )
  @ApiUnauthorizedErrorResponse(
    generatePathExample("/comments", SWAGGER_EXAMPLES.COMMENT_ID),
  )
  @ApiDatabaseExceptionResponses(
    generatePathExample("/comments", SWAGGER_EXAMPLES.COMMENT_ID),
  )
  public async update(
    @Param("commentId", ParseUUIDPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.update(commentId, updateCommentDto);
  }
}
