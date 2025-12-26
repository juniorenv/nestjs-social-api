import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { DRIZZLE } from "src/drizzle/drizzle.module";
import type { DrizzleDB } from "src/drizzle/types/drizzle";
import { CreateUserDto } from "./dto/create-user.dto";
import { users } from "src/drizzle/schema/users.schema";
import { hash } from "bcrypt";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { profileInfo } from "src/drizzle/schema/profileInfo.schema";
import { eq } from "drizzle-orm";
import { plainToInstance } from "class-transformer";
import { UserResponseDto } from "./dto/user-response.dto";
import { ProfileEntity, UserEntity } from "./dto/user.types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { isObject, mergeWith } from "lodash";

@Injectable()
export class UserService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  private readonly SALT_ROUNDS = 10;

  public async findByEmail(userEmail: string): Promise<UserEntity | null> {
    const foundUser = await this.db.query.users.findFirst({
      where: eq(users.email, userEmail),
    });

    return foundUser || null;
  }

  private async findProfileInfo(userId: string): Promise<ProfileEntity | null> {
    const foundProfileInfo = await this.db.query.profileInfo.findFirst({
      where: eq(profileInfo.userId, userId),
    });

    return foundProfileInfo || null;
  }

  public async checkUserExists(userId: string): Promise<void> {
    const foundUser = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { id: true },
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  public async findOne(userId: string) {
    const foundUser = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        password: false,
      },
      with: {
        profileInfo: {
          columns: { userId: false },
        },
        posts: {
          columns: { authorId: false },
        },
        usersToGroups: {
          columns: {
            groupId: false,
            userId: false,
          },
          with: {
            group: true,
          },
        },
      },
    });

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return foundUser;
  }

  public async create(user: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.findByEmail(user.email);

    if (existingUser) {
      throw new ConflictException("Email already in use");
    }

    const [createdUser] = await this.db
      .insert(users)
      .values({
        ...user,
        password: await hash(user.password, this.SALT_ROUNDS),
      })
      .returning();

    return plainToInstance(UserResponseDto, createdUser);
  }

  public async delete(userId: string): Promise<UserResponseDto> {
    const [deletedUser] = await this.db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return plainToInstance(UserResponseDto, deletedUser);
  }

  public async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    await this.checkUserExists(userId);

    if (updateUserDto.email) {
      const existingEmail = await this.findByEmail(updateUserDto.email);

      if (existingEmail && existingEmail.id !== userId)
        throw new ConflictException("Email already in use");
    }

    const [updatedUser] = await this.db
      .update(users)
      .set({ ...updateUserDto, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return plainToInstance(UserResponseDto, updatedUser);
  }

  public async createProfileInfo(
    userId: string,
    profile: CreateProfileDto,
  ): Promise<ProfileEntity> {
    await this.checkUserExists(userId);

    const existingProfile = await this.findProfileInfo(userId);

    if (existingProfile) {
      throw new ConflictException("This user already has a profile");
    }

    const [createdProfileInfo] = await this.db
      .insert(profileInfo)
      .values({ userId, metadata: profile.metadata })
      .returning();

    return createdProfileInfo;
  }

  public async updateProfileInfo(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileEntity> {
    await this.checkUserExists(userId);

    const existingProfile = await this.findProfileInfo(userId);

    if (!existingProfile) {
      throw new NotFoundException("This user does not have a profile yet");
    }

    if (updateProfileDto.metadata === null) {
      throw new BadRequestException("metadata cannot be null");
    }

    if (updateProfileDto.metadata?.preferences === null) {
      throw new BadRequestException("preferences cannot be null");
    }

    if (updateProfileDto.metadata?.socialLinks === null) {
      throw new BadRequestException("socialLinks cannot be null");
    }

    const customMerger = (objValue: unknown, srcValue: unknown): unknown => {
      if (srcValue === null) return objValue;

      if (Array.isArray(srcValue)) return srcValue;

      if (isObject(objValue) && isObject(srcValue)) {
        return mergeWith({}, objValue, srcValue, customMerger);
      }
      return srcValue;
    };

    const updatedMetadata = updateProfileDto.metadata
      ? mergeWith(
          {},
          existingProfile.metadata,
          updateProfileDto.metadata,
          customMerger,
        )
      : existingProfile.metadata;

    const [updatedProfileInfo] = await this.db
      .update(profileInfo)
      .set({ metadata: updatedMetadata, updatedAt: new Date() })
      .where(eq(profileInfo.userId, userId))
      .returning();

    return updatedProfileInfo;
  }
}
