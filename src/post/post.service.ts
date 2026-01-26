import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { DrizzleDB } from "../drizzle/types/drizzle";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { eq } from "drizzle-orm";
import { posts } from "src/drizzle/schema/posts.schema";
import { CreatePostDto } from "./dto/create-post.dto";
import { UserService } from "src/user/user.service";
import { UpdatePostDto } from "./dto/update-post.dto";
import { plainToInstance } from "class-transformer";
import { PostDetailResponseDto } from "./dto/post-detail-response.dto";
import { PostResponseDto } from "./dto/post-response.dto";

@Injectable()
export class PostService {
  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly userService: UserService,
  ) {}

  public async findOne(postId: string): Promise<PostDetailResponseDto> {
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

    return plainToInstance(PostDetailResponseDto, foundPost);
  }

  public async create(
    authorId: string,
    post: CreatePostDto,
  ): Promise<PostResponseDto> {
    await this.userService.checkUserExists(authorId);

    const [createdPost] = await this.db
      .insert(posts)
      .values({
        authorId,
        ...post,
      })
      .returning();

    return plainToInstance(PostResponseDto, createdPost);
  }

  public async delete(postId: string): Promise<PostResponseDto> {
    const [deletedPost] = await this.db
      .delete(posts)
      .where(eq(posts.id, postId))
      .returning();

    if (!deletedPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return plainToInstance(PostResponseDto, deletedPost);
  }

  public async update(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const [updatedPost] = await this.db
      .update(posts)
      .set({ ...updatePostDto, updatedAt: new Date() })
      .where(eq(posts.id, postId))
      .returning();

    if (!updatedPost) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return plainToInstance(PostResponseDto, updatedPost);
  }
}
