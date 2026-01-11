import { PartialType } from "@nestjs/swagger";
import { CreateGroupDto } from "./create-group.dto";
import { AtLeastOneField } from "src/common/decorators/at-least-one-property.decorator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

@AtLeastOneField(["name", "description"])
export class UpdateGroupDto extends PartialType(CreateGroupDto) {
  @ApiPropertyOptional({
    description: "New group name (must be unique)",
    example: "Rust",
    minLength: 2,
    maxLength: 25,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(25)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: "Updated group description",
    example: "An advanced community for TypeScript experts",
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  description?: string;
}
