import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "User's full name",
    example: "John Doe",
    minLength: 2,
    maxLength: 32,
  })
  @IsString()
  @Length(2, 32, { message: "Name must be between 2 and 32 characters" })
  name: string;

  @ApiProperty({
    description: "User's email address (must be unique)",
    example: "john.doe@example.com",
    format: "email",
  })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @ApiProperty({
    description: "User's password (will be hashed before storage)",
    example: "SecurePassword123!",
    minLength: 8,
    maxLength: 50,
    format: "password",
  })
  @IsString()
  @Length(8, 50, { message: "Password must be between 8 and 50 characters" })
  password: string;
}
