import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {
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
