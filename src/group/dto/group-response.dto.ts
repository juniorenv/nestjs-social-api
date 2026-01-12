import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class GroupResponseDto {
  @ApiProperty({
    description: "Group unique identifier",
    example: "456e4567-e89b-12d3-a456-426614174111",
    format: "uuid",
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
    description: "Group creator/owner ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  createdById: string;

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
