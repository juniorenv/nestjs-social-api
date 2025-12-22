import { PartialType } from "@nestjs/swagger";
import { CreatePostDto } from "./create-post.dto";
import { AtLeastOneField } from "src/common/decorators/at-least-one-property.decorator";
import { ApiPropertyOptional } from "@nestjs/swagger";

@AtLeastOneField(["title", "content"])
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({
    description: "Updated post title",
    example: "Advanced TypeScript Generics",
    minLength: 5,
    maxLength: 100,
  })
  title?: string;

  @ApiPropertyOptional({
    description: "Updated post content",
    example: "This updated content covers advanced generic patterns...",
    minLength: 1,
    maxLength: 280,
  })
  content?: string;
}
