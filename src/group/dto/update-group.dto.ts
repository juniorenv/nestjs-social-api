import { PartialType, PickType } from "@nestjs/swagger";
import { CreateGroupDto } from "./create-group.dto";
import { AtLeastOneField } from "src/common/decorators/at-least-one-property.decorator";
import { ApiPropertyOptional } from "@nestjs/swagger";

@AtLeastOneField(["name"])
export class UpdateGroupDto extends PartialType(
  PickType(CreateGroupDto, ["name"] as const),
) {
  @ApiPropertyOptional({
    description: "New group name (must be unique)",
    example: "Rust",
    minLength: 1,
    maxLength: 10,
  })
  name?: string;
}
