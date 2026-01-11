import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateGroupDto {
  @ApiProperty({
    description: "Group name (must be unique)",
    example: "TypeScript",
    minLength: 2,
    maxLength: 25,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  name: string;

  @ApiPropertyOptional({
    description: "Group description",
    example: "A community for TypeScript enthusiasts",
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
