import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

class GroupCreatorDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "John Doe" })
  name: string;
}

class GroupMemberDto {
  @ApiProperty({ example: "987e4567-e89b-12d3-a456-426614174999" })
  id: string;

  @ApiProperty({ example: "Jane Smith" })
  name: string;

  @ApiProperty({ example: "member", enum: ["member", "owner"] })
  role: "member" | "owner";

  @ApiProperty({ example: "2025-12-14T10:30:00.000Z" })
  joinedAt: Date;
}

export class GroupDetailResponseDto {
  @ApiProperty({
    description: "Group unique identifier",
    example: "456e4567-e89b-12d3-a456-426614174111",
  })
  id: string;

  @ApiProperty({
    description: "Group name",
    example: "TypeScript Developers",
  })
  name: string;

  @ApiPropertyOptional({
    description: "Group description",
    example: "A community for TypeScript enthusiasts",
  })
  description?: string;

  @ApiProperty({
    description: "Group creation timestamp",
    example: "2025-12-14T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Group last update timestamp",
    example: "2025-12-14T10:30:00.000Z",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Group creator information",
    type: GroupCreatorDto,
  })
  creator: GroupCreatorDto;

  @ApiProperty({
    description: "Group members with their roles",
    type: [GroupMemberDto],
  })
  members: GroupMemberDto[];
}
