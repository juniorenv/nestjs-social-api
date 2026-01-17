import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { UserModule } from "src/user/user.module";

@Module({
  providers: [CommentService],
  controllers: [CommentController],
  imports: [DrizzleModule, UserModule],
  exports: [CommentService],
})
export class CommentModule {}
