import { ApiProperty } from "@nestjs/swagger";

class AuthorSummaryDto {
  @ApiProperty({
    description: "Author's unique identifier",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Author's full name",
    example: "John Doe",
  })
  name: string;
}

class CommentAuthorDto {
  @ApiProperty({
    description: "Comment author's unique identifier",
    example: "987e4567-e89b-12d3-a456-426614174999",
  })
  id: string;

  @ApiProperty({
    description: "Comment author's full name",
    example: "Jane Smith",
  })
  name: string;
}

class CommentDto {
  @ApiProperty({
    description: "Comment unique identifier",
    example: "654e4567-e89b-12d3-a456-426614174444",
  })
  id: string;

  @ApiProperty({
    description: "Comment text content",
    example: "Great post! Very informative.",
    maxLength: 280,
  })
  text: string;

  @ApiProperty({
    description: "Comment creation timestamp",
    example: "2025-12-14T11:00:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Comment last update timestamp",
    example: "2025-12-14T11:00:00.000Z",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Comment author information",
    type: CommentAuthorDto,
  })
  author: CommentAuthorDto;
}

export class PostDetailResponseDto {
  @ApiProperty({
    description: "Post unique identifier",
    example: "321e4567-e89b-12d3-a456-426614174333",
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
    example:
      "This post explains how to use TypeScript generics effectively in real-world applications. Generics allow you to write reusable code that works with multiple types...",
    minLength: 1,
    maxLength: 280,
  })
  content: string;

  @ApiProperty({
    description: "Post creation timestamp",
    example: "2025-12-14T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Post last update timestamp",
    example: "2025-12-14T10:30:00.000Z",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "Post author information",
    type: AuthorSummaryDto,
  })
  author: AuthorSummaryDto;

  @ApiProperty({
    description: "List of comments on this post",
    type: [CommentDto],
  })
  comments: CommentDto[];
}
