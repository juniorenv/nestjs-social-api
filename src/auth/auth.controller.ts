import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "src/user/dto/create-user.dto";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in-dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SignUpResponseDto } from "./dto/sign-up-response.dto";
import { SWAGGER_EXAMPLES } from "src/common/constants/swagger-examples.constants";
import {
  ApiConflictErrorResponse,
  ApiDatabaseExceptionResponses,
} from "src/common/decorators/swagger/api-error-responses.decorator";
import { SignInResponseDto } from "./dto/sign-in-response.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @ApiOperation({
    summary: "Register a new user",
    description:
      "Creates a new user account with hashed password and returns an access token for immediate authentication. The email must be unique and not already registered. Password is automatically hashed using bcrypt before storage. This endpoint is public and does not require authentication.",
  })
  @ApiResponse({
    status: 201,
    description: "User registered successfully with access token",
    type: SignUpResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
    schema: {
      example: {
        statusCode: 400,
        timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
        path: "/auth/signup",
        message: {
          message: [
            "name must be between 2 and 32 characters",
            "name must be a string",
            "invalid email format",
            "Password must be between 8 and 50 characters",
            "password must be a string",
          ],
          error: "Bad Request",
        },
      },
    },
  })
  @ApiConflictErrorResponse("Email already in use", "/auth/signup")
  @ApiDatabaseExceptionResponses("/auth/signup")
  public async signUp(@Body() userDto: CreateUserDto) {
    return this.authService.signUp(userDto);
  }

  @Post("signin")
  @ApiOperation({
    summary: "Authenticate user",
    description:
      "Authenticates a user with email and password credentials. Returns a JWT access token on successful authentication. The token should be included in the Authorization header as 'Bearer {token}' for protected endpoints. This endpoint is public and does not require authentication.",
  })
  @ApiResponse({
    status: 201,
    description: "User authenticated successfully",
    type: SignInResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Validation error",
    schema: {
      example: {
        statusCode: 400,
        timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
        path: "/auth/signin",
        message: {
          message: [
            "invalid email format",
            "Password must be between 8 and 50 characters",
            "password must be a string",
          ],
          error: "Bad Request",
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Invalid credentials",
    schema: {
      example: {
        statusCode: 401,
        timestamp: SWAGGER_EXAMPLES.TIMESTAMP,
        path: "/auth/signin",
        message: {
          message: "Invalid credentials",
          error: "Unauthorized",
        },
      },
    },
  })
  @ApiDatabaseExceptionResponses("/auth/signin")
  public async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
