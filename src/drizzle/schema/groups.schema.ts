import {
  primaryKey,
  text,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { relations, sql } from "drizzle-orm";
import { pgEnum, uniqueIndex } from "drizzle-orm/pg-core";

export const memberRoleEnum = pgEnum("member_role", ["member", "owner"]);

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  createdById: uuid("created_by_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// The joint table
export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groups.id, {
        onDelete: "cascade",
      }),
    role: memberRoleEnum().default("member").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.groupId] }),
    uniqueIndex("idx_one_owner_per_group")
      .on(table.groupId)
      .where(sql`${table.role} = 'owner'`),
  ],
);

export const groupsRelations = relations(groups, ({ one, many }) => ({
  creator: one(users, {
    fields: [groups.createdById],
    references: [users.id],
  }),
  usersToGroups: many(usersToGroups),
}));

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
}));
