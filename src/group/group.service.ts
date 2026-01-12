import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import { groups, usersToGroups } from "src/drizzle/schema/groups.schema";
import type { DrizzleDB } from "src/drizzle/types/drizzle";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { GroupEntity } from "./dto/group.types";
import { users } from "src/drizzle/schema/users.schema";
import {
  isDrizzleDbError,
  PG_ERROR_CODES,
} from "src/drizzle/types/error.types";

@Injectable()
export class GroupService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  public async findOne(groupId: string) {
    const foundGroup = await this.db.query.groups.findFirst({
      where: eq(groups.id, groupId),
      columns: {
        createdById: false,
      },
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            email: false,
            password: false,
          },
        },
        usersToGroups: {
          columns: { role: true, joinedAt: true },
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: false,
                password: false,
              },
            },
          },
        },
      },
    });

    if (!foundGroup) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const { usersToGroups, ...groupData } = foundGroup;

    return {
      ...groupData,
      members: usersToGroups.map((utg) => ({
        id: utg.user.id,
        name: utg.user.name,
        role: utg.role,
        joinedAt: utg.joinedAt,
      })),
    };
  }

  public async create(
    createdById: string,
    group: CreateGroupDto,
  ): Promise<GroupEntity> {
    try {
      return await this.db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.id, createdById),
          columns: { id: true },
        });

        if (!user) {
          throw new NotFoundException(`User with ID ${createdById} not found`);
        }

        const [createdGroup] = await tx
          .insert(groups)
          .values({
            name: group.name,
            description: group.description,
            createdById,
          })
          .returning();

        await tx.insert(usersToGroups).values({
          userId: createdById,
          groupId: createdGroup.id,
          role: "owner",
        });

        return createdGroup;
      });
    } catch (error: any) {
      if (isDrizzleDbError(error)) {
        const dbError = error.cause;

        if (dbError.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
          if (dbError.constraint === "groups_name_unique") {
            throw new ConflictException("Group name already exists");
          }
        }
      }
      throw error;
    }
  }

  /**
   * Delete group
   * Only owner can delete
   */
  public async delete(groupId: string): Promise<GroupEntity> {
    const [deletedGroup] = await this.db
      .delete(groups)
      .where(eq(groups.id, groupId))
      .returning();

    if (!deletedGroup) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    return deletedGroup;
  }

  /**
   * Update group
   * Only owner can update
   */
  public async update(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
  ): Promise<GroupEntity> {
    try {
      const [updatedGroup] = await this.db
        .update(groups)
        .set({ ...updateGroupDto, updatedAt: new Date() })
        .where(eq(groups.id, groupId))
        .returning();

      if (!updatedGroup) {
        throw new NotFoundException(`Group with ID ${groupId} not found`);
      }

      return updatedGroup;
    } catch (error: any) {
      if (isDrizzleDbError(error)) {
        const dbError = error.cause;

        if (dbError.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
          if (dbError.constraint === "groups_name_unique") {
            throw new ConflictException("Group name already exists");
          }
        }
      }
      throw error;
    }
  }

  /**
   * Join group as member
   */
  public async joinGroup(groupId: string, userId: string) {
    try {
      return await this.db.transaction(async (tx) => {
        const foundGroup = await tx.query.groups.findFirst({
          where: eq(groups.id, groupId),
          columns: { id: true },
        });

        if (!foundGroup) {
          throw new NotFoundException(`Group with ID ${groupId} not found`);
        }

        const foundUser = await tx.query.users.findFirst({
          where: eq(users.id, userId),
          columns: { id: true },
        });

        if (!foundUser) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const existingMembership = await tx.query.usersToGroups.findFirst({
          where: and(
            eq(usersToGroups.userId, userId),
            eq(usersToGroups.groupId, groupId),
          ),
        });

        if (existingMembership) {
          throw new ConflictException(
            `User ${userId} is already a member of this group`,
          );
        }

        const [membership] = await tx
          .insert(usersToGroups)
          .values({
            groupId,
            userId,
            role: "member",
          })
          .returning();

        return membership;
      });
    } catch (error: any) {
      if (isDrizzleDbError(error)) {
        const dbError = error.cause;

        if (dbError.code === PG_ERROR_CODES.UNIQUE_VIOLATION) {
          throw new ConflictException("User is already a member of this group");
        }
      }
      throw error;
    }
  }

  /**
   * Leave group
   * Owner cannot leave (must transfer ownership or delete group)
   */
  public async leaveGroup(
    groupId: string,
    userId: string,
  ): Promise<{ message: string }> {
    return await this.db.transaction(async (tx) => {
      const membership = await tx.query.usersToGroups.findFirst({
        where: and(
          eq(usersToGroups.userId, userId),
          eq(usersToGroups.groupId, groupId),
        ),
      });

      if (!membership) {
        throw new NotFoundException(
          `User ${userId} is not a member of this group`,
        );
      }

      if (membership.role === "owner") {
        throw new ForbiddenException(
          "Group owner cannot leave. Transfer ownership or delete the group",
        );
      }

      await tx
        .delete(usersToGroups)
        .where(
          and(
            eq(usersToGroups.groupId, groupId),
            eq(usersToGroups.userId, userId),
          ),
        );

      return { message: `Member ${userId} has successfully left the group` };
    });
  }

  /**
   * Remove member from group
   * Only owner can remove members
   */
  public async removeMember(groupId: string, userIdToRemove: string) {
    return await this.db.transaction(async (tx) => {
      const membership = await tx.query.usersToGroups.findFirst({
        where: and(
          eq(usersToGroups.userId, userIdToRemove),
          eq(usersToGroups.groupId, groupId),
        ),
      });

      if (!membership) {
        throw new NotFoundException(
          `User ${userIdToRemove} is not a member of this group`,
        );
      }

      if (membership.role === "owner") {
        throw new ForbiddenException("Cannot remove the group owner");
      }

      await tx
        .delete(usersToGroups)
        .where(
          and(
            eq(usersToGroups.groupId, groupId),
            eq(usersToGroups.userId, userIdToRemove),
          ),
        );

      return {
        message: `Member ${userIdToRemove} has been successfully removed`,
      };
    });
  }

  /**
   * Check if users is group owner
   */
  public async checkOwnership(groupId: string, userId: string): Promise<void> {
    const membership = await this.db.query.usersToGroups.findFirst({
      where: and(
        eq(usersToGroups.userId, userId),
        eq(usersToGroups.groupId, groupId),
      ),
    });

    if (!membership) {
      throw new ForbiddenException("You are not a member of this group");
    }

    if (membership.role !== "owner") {
      throw new ForbiddenException(
        "Only the group owner can perform this action",
      );
    }
  }
}
