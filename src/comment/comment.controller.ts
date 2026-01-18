import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
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
import { SWAGGER_EXAMPLES } from "src/common/constants/swagger-examples.constants";
import { AuthGuard } from "src/auth/auth.guard";
import { CommentResponseDto } from "./dto/comment-response.dto";
import { ResourceOwnershipGuard } from "src/common/guards/resource-ownership.guard";
import { ResourceType } from "src/common/decorators/resource-type.decorator";

@Controller("comments")
@ApiTags("comments")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Delete(":commentId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, ResourceOwnershipGuard)
  @ResourceType("comment")
  @ApiOperation({
    summary: "Delete a comment",
    description:
      "Permanently deletes a comment. The comment will be removed from the database and cannot be recovered. Only the comment author can delete the comment. Requires authentication. This action cannot be undone.",
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
  @ApiResponse({
    status: 403,
    description: "Forbidden - Not the comment author",
    content: {
      "application/json": {
        example: {
          statusCode: 403,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: "/comments/" + SWAGGER_EXAMPLES.COMMENT_ID,
          message: {
            message: "You can only modify your own comments",
            error: "Forbidden",
          },
        },
      },
    },
  })
  @ApiNotFoundErrorResponse(
    "Comment",
    "/comments/" + SWAGGER_EXAMPLES.COMMENT_ID,
  )
  @ApiInvalidUUIDResponse("/comments/invalid-uuid")
  @ApiUnauthorizedErrorResponse("/comments/" + SWAGGER_EXAMPLES.COMMENT_ID)
  @ApiDatabaseExceptionResponses("/comments/" + SWAGGER_EXAMPLES.COMMENT_ID)
  public async delete(
    @Param("commentId", ParseUUIDPipe) commentId: string,
  ): Promise<CommentEntity> {
    return this.commentService.delete(commentId);
  }

  @Patch(":commentId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard, ResourceOwnershipGuard)
  @ResourceType("comment")
  @ApiOperation({
    summary: "Update comment text",
    description:
      "Updates the comment's text content. The text field is required and must be between 1-280 characters. Only the text can be updated - author and post associations cannot be changed. Only the comment author can update the comment. Requires authentication.",
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
    description: "Bad Request - Validation error",
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
              path: "/comments/" + SWAGGER_EXAMPLES.COMMENT_ID,
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
  @ApiResponse({
    status: 403,
    description: "Forbidden - Not the comment author",
    content: {
      "application/json": {
        example: {
          statusCode: 403,
          timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
          path: "/comments/" + SWAGGER_EXAMPLES.COMMENT_ID,
          message: {
            message: "You can only modify your own comments",
            error: "Forbidden",
          },
        },
      },
    },
  })
  @ApiNotFoundErrorResponse(
    "Comment",
    "/comments/" + SWAGGER_EXAMPLES.COMMENT_ID,
  )
  @ApiUnauthorizedErrorResponse("/comments/" + SWAGGER_EXAMPLES.COMMENT_ID)
  @ApiDatabaseExceptionResponses("/comments/" + SWAGGER_EXAMPLES.COMMENT_ID)
  public async update(
    @Param("commentId", ParseUUIDPipe) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    return this.commentService.update(commentId, updateCommentDto);
  }

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
    "/comments/" + SWAGGER_EXAMPLES.COMMENT_ID,
  )
  @ApiInvalidUUIDResponse("/comments/invalid-uuid")
  @ApiDatabaseExceptionResponses("/comments/" + SWAGGER_EXAMPLES.COMMENT_ID)
  public async findOne(@Param("commentId", ParseUUIDPipe) commentId: string) {
    return this.commentService.findOne(commentId);
  }
}
