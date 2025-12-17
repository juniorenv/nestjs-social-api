import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateGroupDto {
  @ApiProperty({
    description: "Group name (must be unique)",
    example: "TypeScript",
    minLength: 1,
    maxLength: 10,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  name: string;
}
