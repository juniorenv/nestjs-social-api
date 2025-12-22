import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreatePostDto {
  @ApiProperty({
    description: "Post title",
    example: "Understanding TypeScript Generics",
    minLength: 5,
    maxLength: 100,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: "Post content/body",
    example: "This post explains how to use TypeScript generics effectively...",
    minLength: 1,
    maxLength: 280,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(280)
  content: string;
}
