import { Module } from "@nestjs/common";
import { PostService } from "./post.service";
import { PostController } from "./post.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { UserModule } from "src/user/user.module";
import { CommentModule } from "src/comment/comment.module";

@Module({
  providers: [PostService],
  controllers: [PostController],
  imports: [DrizzleModule, UserModule, CommentModule],
})
export class PostModule {}
