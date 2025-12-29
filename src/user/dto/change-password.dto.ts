import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    description: "Current password for verification",
    example: "MyOldP@ssw0rd123",
    minLength: 8,
    maxLength: 50,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  currentPassword: string;

  @ApiProperty({
    description: "New password",
    example: "MyNewP@ssw0rd456",
    minLength: 8,
    maxLength: 50,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  newPassword: string;
}
