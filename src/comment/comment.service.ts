import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { comments } from "src/drizzle/schema/comments.schema";
import type { DrizzleDB } from "src/drizzle/types/drizzle";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UserService } from "src/user/user.service";
import { posts } from "src/drizzle/schema/posts.schema";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { CommentDetailResponseDto } from "./dto/comment-detail-response.dto";
import { plainToInstance } from "class-transformer";
import { CommentResponseDto } from "./dto/comment-response.dto";

@Injectable()
export class CommentService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly userService: UserService,
  ) {}

  private async checkPostExists(postId: string): Promise<void> {
    const foundPost = await this.db.query.posts.findFirst({
      where: eq(posts.id, postId),
      columns: {
        id: true,
      },
    });

    if (!foundPost)
      throw new NotFoundException(`Post with ID ${postId} not found`);
  }

  public async findOne(commentId: string): Promise<CommentDetailResponseDto> {
    const foundComment = await this.db.query.comments.findFirst({
      where: eq(comments.id, commentId),
      columns: {
        authorId: false,
        postId: false,
      },
      with: {
        author: {
          columns: { id: true, name: true, email: false, password: false },
        },
        post: {
          columns: { authorId: false },
          with: {
            author: { columns: { id: true, name: true, password: false } },
          },
        },
      },
    });

    if (!foundComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    return plainToInstance(CommentDetailResponseDto, foundComment);
  }

  public async create(
    authorId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<CommentResponseDto> {
    await this.userService.checkUserExists(authorId);
    await this.checkPostExists(postId);

    const [createdComment] = await this.db
      .insert(comments)
      .values({ authorId, postId, text: createCommentDto.text })
      .returning();

    return plainToInstance(CommentResponseDto, createdComment);
  }

  public async delete(commentId: string): Promise<CommentResponseDto> {
    const [deletedComment] = await this.db
      .delete(comments)
      .where(eq(comments.id, commentId))
      .returning();

    if (!deletedComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    return plainToInstance(CommentResponseDto, deletedComment);
  }

  public async update(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentResponseDto> {
    const [updatedComment] = await this.db
      .update(comments)
      .set({ ...updateCommentDto, updatedAt: new Date() })
      .where(eq(comments.id, commentId))
      .returning();

    if (!updatedComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    return plainToInstance(CommentResponseDto, updatedComment);
  }
}
