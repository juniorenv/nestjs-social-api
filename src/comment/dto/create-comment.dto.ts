import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    description: "Author's user ID (must be an existing user)",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @IsUUID()
  authorId: string;

  @ApiProperty({
    description: "Post ID this comment belongs to (must be an existing post)",
    example: "321e4567-e89b-12d3-a456-426614174333",
    format: "uuid",
  })
  @IsUUID()
  postId: string;

  @ApiProperty({
    description: "Comment text content",
    example: "Great post! Very informative and well-written.",
    minLength: 1,
    maxLength: 280,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  text: string;
}
