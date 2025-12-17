import { ApiProperty } from "@nestjs/swagger";

export class MemberOperationResponseDto {
  @ApiProperty({
    description: "Operation result message",
    example:
      "Member 123e4567-e89b-12d3-a456-426614174000 has been successfully added",
  })
  message: string;
}
