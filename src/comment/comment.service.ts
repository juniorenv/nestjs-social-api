import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { comments } from "src/drizzle/schema/comments.schema";
import type { DrizzleDB } from "src/drizzle/types/drizzle";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UserService } from "src/user/user.service";
import { posts } from "src/drizzle/schema/posts.schema";
import { CommentEntity } from "./dto/comment.types";
import { UpdateCommentDto } from "./dto/update-comment.dto";

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

  public async findOne(commentId: string) {
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

    return foundComment;
  }

  public async create(
    createCommentDto: CreateCommentDto,
  ): Promise<CommentEntity> {
    await this.userService.checkUserExists(createCommentDto.authorId);
    await this.checkPostExists(createCommentDto.postId);

    const [createdComment] = await this.db
      .insert(comments)
      .values(createCommentDto)
      .returning();

    return createdComment;
  }

  public async delete(commentId: string): Promise<CommentEntity> {
    const [deletedComment] = await this.db
      .delete(comments)
      .where(eq(comments.id, commentId))
      .returning();

    if (!deletedComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    return deletedComment;
  }

  public async update(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<CommentEntity> {
    const [updatedComment] = await this.db
      .update(comments)
      .set({ ...updateCommentDto, updatedAt: new Date() })
      .where(eq(comments.id, commentId))
      .returning();

    if (!updatedComment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }
    return updatedComment;
  }
}
