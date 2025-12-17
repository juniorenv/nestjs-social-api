import { ApiProperty } from "@nestjs/swagger";

export class GroupResponseDto {
  @ApiProperty({
    description: "Group unique identifier",
    example: "456e4567-e89b-12d3-a456-426614174111",
    format: "uuid",
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
    type: "string",
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Group last update timestamp",
    example: "2025-12-14T10:30:00.000Z",
    type: "string",
    format: "date-time",
  })
  updatedAt: Date;
}
