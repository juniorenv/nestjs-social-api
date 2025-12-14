import { PartialType, PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { AtLeastOneField } from "src/common/decorators/at-least-one-property.decorator";
import { ApiPropertyOptional } from "@nestjs/swagger";

@AtLeastOneField(["name", "email"])
export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ["name", "email"] as const),
) {
  @ApiPropertyOptional({
    description: "User's full name",
    example: "Jane Doe",
    minLength: 2,
    maxLength: 32,
  })
  name?: string;

  @ApiPropertyOptional({
    description: "User's email address (must be unique)",
    example: "jane.doe@example.com",
    format: "email",
  })
  email?: string;
}
