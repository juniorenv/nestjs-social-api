import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import type { DrizzleDB } from "src/drizzle/types/drizzle";
import { posts } from "src/drizzle/schema/posts.schema";
import { comments } from "src/drizzle/schema/comments.schema";
import { eq } from "drizzle-orm";

@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user?.sub) {
      throw new UnauthorizedException("Authentication required");
    }

    const resourceType = this.reflector.get<string>(
      "resourceType",
      context.getHandler(),
    );

    if (!resourceType) {
      return true;
    }

    switch (resourceType) {
      case "post":
        return this.checkPostOwnership(request.params.postId, user.sub);

      case "comment":
        return this.checkCommentOwnership(request.params.commentId, user.sub);

      default:
        return true;
    }
  }

  private async checkPostOwnership(
    postId: string,
    userId: string,
  ): Promise<boolean> {
    const post = await this.db.query.posts.findFirst({
      where: eq(posts.id, postId),
      columns: { id: true, authorId: true },
    });

    if (!post) {
      throw new ForbiddenException("Post not found");
    }

    if (post.authorId !== userId) {
      throw new ForbiddenException("You can only modify your own posts");
    }

    return true;
  }

  private async checkCommentOwnership(
    commentId: string,
    userId: string,
  ): Promise<boolean> {
    const comment = await this.db.query.comments.findFirst({
      where: eq(comments.id, commentId),
      columns: { id: true, authorId: true },
    });

    if (!comment) {
      throw new ForbiddenException("Comment not found");
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException("You can only modify your own comments");
    }

    return true;
  }
}
