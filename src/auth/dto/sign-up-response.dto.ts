import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "src/user/dto/user-response.dto";

export class SignUpResponseDto {
  @ApiProperty({
    description: "JWT access token for authentication",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzM0MTgwMDAwLCJleHAiOjE3MzQxODM2MDB9.signature",
  })
  accessToken: string;

  @ApiProperty({
    description: "Created user information",
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
