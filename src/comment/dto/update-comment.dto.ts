import { ApiPropertyOptional, PartialType, PickType } from "@nestjs/swagger";
import { CreateCommentDto } from "./create-comment.dto";
import { AtLeastOneField } from "src/common/decorators/at-least-one-property.decorator";

@AtLeastOneField(["text"])
export class UpdateCommentDto extends PartialType(
  PickType(CreateCommentDto, ["text"] as const),
) {
  @ApiPropertyOptional({
    description: "Updated comment text",
    example: "Updated: This is even better after reading it again!",
    minLength: 1,
    maxLength: 280,
  })
  text?: string;
}
