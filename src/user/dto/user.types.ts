import { profileInfo } from "src/drizzle/schema/profileInfo.schema";
import { users } from "src/drizzle/schema/users.schema";

export type UserEntity = typeof users.$inferSelect;

export type ProfileEntity = typeof profileInfo.$inferSelect;
