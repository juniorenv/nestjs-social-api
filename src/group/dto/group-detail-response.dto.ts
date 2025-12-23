import { ApiProperty } from "@nestjs/swagger";

class UserSummaryDto {
  @ApiProperty({
    description: "User unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "User's full name",
    example: "John Doe",
  })
  name: string;
}

class GroupMemberDto {
  @ApiProperty({
    description: "User information",
    type: UserSummaryDto,
  })
  user: UserSummaryDto;
}

export class GroupDetailResponseDto {
  @ApiProperty({
    description: "Group unique identifier",
    example: "456e4567-e89b-12d3-a456-426614174111",
  })
  id: string;

  @ApiProperty({
    description: "Group name",
    example: "TypeScript",
  })
  name: string;

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
    description: "List of users who are members of this group",
    type: [GroupMemberDto],
  })
  usersToGroups: GroupMemberDto[];
}
