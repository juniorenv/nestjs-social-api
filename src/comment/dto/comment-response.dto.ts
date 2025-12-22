import { ApiProperty } from "@nestjs/swagger";

export class CommentResponseDto {
  @ApiProperty({
    description: "Comment unique identifier",
    example: "654e4567-e89b-12d3-a456-426614174444",
    format: "uuid",
  })
  id: string;

  @ApiProperty({
    description: "Comment text content",
    example: "Great post! Very informative.",
    minLength: 1,
    maxLength: 280,
  })
  text: string;

  @ApiProperty({
    description: "Comment creation timestamp",
    example: "2025-12-14T11:00:00.000Z",
    type: "string",
    format: "date-time",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Comment last update timestamp",
    example: "2025-12-14T11:00:00.000Z",
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

  @ApiProperty({
    description: "Post ID this comment belongs to",
    example: "321e4567-e89b-12d3-a456-426614174333",
    format: "uuid",
  })
  postId: string;
}
