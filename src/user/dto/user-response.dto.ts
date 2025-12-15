import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class UserResponseDto {
  @ApiProperty({
    description: "User unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    description: "User's full name",
    example: "Jane Doe",
  })
  name: string;

  @ApiProperty({
    description: "User's email address",
    example: "jane.doe@example.com",
    format: "email",
  })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({
    description: "User creation timestamp",
    example: "2025-12-14T10:30:00.000Z",
    type: "string",
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    description: "User last update timestamp",
    example: "2025-12-14T15:45:00.000Z",
    type: "string",
    format: "date-time",
  })
  updatedAt: Date;
}
