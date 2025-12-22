import { ApiProperty } from "@nestjs/swagger";

export class PostResponseDto {
  @ApiProperty({
    description: "Post unique identifier",
    example: "321e4567-e89b-12d3-a456-426614174333",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    description: "Post title",
    example: "Understanding TypeScript Generics",
    minLength: 5,
    maxLength: 100,
  })
  title: string;

  @ApiProperty({
    description: "Post content",
    example: "This post explains how to use TypeScript generics effectively...",
    minLength: 1,
    maxLength: 280,
  })
  content: string;

  @ApiProperty({
    description: "Post creation timestamp",
    example: "2025-12-14T10:30:00.000Z",
    type: "string",
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Post last update timestamp",
    example: "2025-12-14T15:45:00.000Z",
    type: "string",
    format: "date-time",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Author's user ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  authorId: string;
}
