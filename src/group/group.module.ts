import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { GroupService } from "./group.service";
import { GroupController } from "./group.controller";

@Module({
  providers: [GroupService],
  controllers: [GroupController],
  imports: [DrizzleModule],
  exports: [GroupService],
})
export class GroupModule {}
