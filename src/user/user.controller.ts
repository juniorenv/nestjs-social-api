import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { ProfileEntity } from "./dto/user.types";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("users")
@ApiTags("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":userId")
  public async findOne(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.userService.findOne(userId);
  }

  @Post()
  public async create(@Body() user: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(user);
  }

  @Delete(":userId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  public async delete(
    @Param("userId", ParseUUIDPipe) userId: string,
  ): Promise<UserResponseDto> {
    return this.userService.delete(userId);
  }

  @Patch(":userId")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  public async update(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(userId, updateUserDto);
  }

  @Post(":userId/profile")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  public async createProfileInfo(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() profileInfo: CreateProfileDto,
  ): Promise<ProfileEntity> {
    return this.userService.createProfileInfo(userId, profileInfo);
  }

  @Patch(":userId/profile")
  @ApiBearerAuth("JWT-auth")
  @UseGuards(AuthGuard)
  public async updateProfileInfo(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ProfileEntity> {
    return this.userService.updateProfileInfo(userId, updateProfileDto);
  }
}
