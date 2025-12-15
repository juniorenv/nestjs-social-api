import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class SocialLinksDto {
  @ApiPropertyOptional({ example: "https://twitter.com/johndoe" })
  twitter?: string;

  @ApiPropertyOptional({ example: "https://linkedin.com/in/johndoe" })
  linkedin?: string;

  @ApiPropertyOptional({ example: "https://github.com/johndoe" })
  github?: string;
}

class PreferencesDto {
  @ApiProperty({ example: "dark", enum: ["light", "dark", "system"] })
  theme: string;

  @ApiProperty({ example: true })
  notifications: boolean;

  @ApiProperty({ example: "en", enum: ["en", "fr", "es", "pt"] })
  language: string;

  @ApiPropertyOptional({ example: true })
  emailNotifications?: boolean;

  @ApiPropertyOptional({ example: "America/New_York" })
  timezone?: string;
}

class ProfileMetadataDto {
  @ApiProperty({ example: "Full-stack developer passionate about TypeScript" })
  bio: string;

  @ApiProperty({ example: "https://i.pravatar.cc/300" })
  avatar: string;

  @ApiProperty({ example: "+5577996483728" })
  phone: string;

  @ApiProperty({ example: "Brazil" })
  location: string;

  @ApiProperty({ example: "https://johndoe.dev" })
  website: string;

  @ApiPropertyOptional({ type: SocialLinksDto })
  socialLinks?: SocialLinksDto;

  @ApiProperty({ type: PreferencesDto })
  preferences: PreferencesDto;

  @ApiPropertyOptional({ example: "Software Engineer" })
  occupation?: string;

  @ApiPropertyOptional({ example: "Nvidia" })
  company?: string;

  @ApiPropertyOptional({ example: ["TypeScript", "React", "Node.js"] })
  skills?: string[];
}

class ProfileInfoDto {
  @ApiProperty({ example: "789e4567-e89b-12d3-a456-426614174222" })
  id: string;

  @ApiProperty({ type: ProfileMetadataDto })
  metadata: ProfileMetadataDto;

  @ApiProperty({ example: "2025-12-14T10:30:00.000Z" })
  createdAt: Date;

  @ApiProperty({ example: "2025-12-14T10:30:00.000Z" })
  updatedAt: Date;
}

class PostSummaryDto {
  @ApiProperty({ example: "987e4567-e89b-12d3-a456-426614174999" })
  id: string;

  @ApiProperty({ example: "My First Blog Post" })
  title: string;

  @ApiProperty({ example: "This is the content of my blog post..." })
  content: string;

  @ApiProperty({ example: "2025-12-14T10:30:00.000Z" })
  createdAt: Date;

  @ApiProperty({ example: "2025-12-14T10:30:00.000Z" })
  updatedAt: Date;
}

class GroupInfoDto {
  @ApiProperty({ example: "456e4567-e89b-12d3-a456-426614174111" })
  id: string;

  @ApiProperty({ example: "TS" })
  name: string;

  @ApiProperty({ example: "2025-12-14T10:30:00.000Z" })
  createdAt: Date;

  @ApiProperty({ example: "2025-12-14T10:30:00.000Z" })
  updatedAt: Date;
}

class UserToGroupDto {
  @ApiProperty({ type: GroupInfoDto })
  group: GroupInfoDto;
}

export class UserDetailResponseDto {
  @ApiProperty({
    description: "User unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({ description: "User's full name", example: "John Doe" })
  name: string;

  @ApiProperty({
    description: "User's email address",
    example: "john.doe@example.com",
  })
  email: string;

  @ApiProperty({ description: "User creation timestamp" })
  createdAt: Date;

  @ApiProperty({ description: "User last update timestamp" })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: "User's profile information",
    type: ProfileInfoDto,
  })
  profileInfo?: ProfileInfoDto;

  @ApiProperty({
    description: "Posts created by the user",
    type: [PostSummaryDto],
  })
  posts: PostSummaryDto[];

  @ApiProperty({
    description: "Groups the user belongs to",
    type: [UserToGroupDto],
  })
  usersToGroups: UserToGroupDto[];
}
