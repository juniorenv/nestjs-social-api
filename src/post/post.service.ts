import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { DrizzleDB } from "../drizzle/types/drizzle";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { eq } from "drizzle-orm";
import { posts } from "src/drizzle/schema/posts.schema";
import { PostEntity } from "./dto/post.types";
import { CreatePostDto } from "./dto/create-post.dto";
import { UserService } from "src/user/user.service";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly userService: UserService,
  ) {}

  public async findOne(postId: string) {
    const foundPost = await this.db.query.posts.findFirst({
      where: eq(posts.id, postId),
      columns: {
        authorId: false,
      },
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            email: false,
            password: false,
          },
        },
        comments: {
          columns: {
            authorId: false,
            postId: false,
          },
          with: {
            author: {
              columns: {
                id: true,
                name: true,
                password: false,
              },
            },
          },
        },
      },
    });

    if (!foundPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return foundPost;
  }

  public async create(
    authorId: string,
    post: CreatePostDto,
  ): Promise<PostEntity> {
    await this.userService.checkUserExists(authorId);

    const [createdPost] = await this.db
      .insert(posts)
      .values({
        authorId,
        ...post,
      })
      .returning();

    return createdPost;
  }

  public async delete(postId: string): Promise<PostEntity> {
    const [deletedPost] = await this.db
      .delete(posts)
      .where(eq(posts.id, postId))
      .returning();

    if (!deletedPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return deletedPost;
  }

  public async update(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    const [updatedPost] = await this.db
      .update(posts)
      .set({ ...updatePostDto, updatedAt: new Date() })
      .where(eq(posts.id, postId))
      .returning();

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return updatedPost;
  }
}
