import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MinLength,
  ValidateNested,
} from "class-validator";

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum Language {
  EN = "en",
  FR = "fr",
  ES = "es",
  PT = "pt",
}

export class SocialLinksDto {
  @ApiPropertyOptional({
    description: "Twitter profile URL",
    example: "https://twitter.com/johndoe",
  })
  @IsOptional()
  @IsUrl({}, { message: "twitter must be a valid URL" })
  twitter?: string;

  @ApiPropertyOptional({
    description: "LinkedIn profile URL",
    example: "https://linkedin.com/in/johndoe",
  })
  @IsOptional()
  @IsUrl({}, { message: "linkedin must be a valid URL" })
  linkedin?: string;

  @ApiPropertyOptional({
    description: "GitHub profile URL",
    example: "https://github.com/johndoe",
  })
  @IsOptional()
  @IsUrl({}, { message: "github must be a valid URL" })
  github?: string;
}

export class PreferencesDto {
  @ApiProperty({
    description: "User interface theme preference",
    enum: Theme,
    example: "dark",
  })
  @IsEnum(Theme, { message: "theme must be light, dark or system" })
  theme: Theme;

  @ApiProperty({
    description: "Enable/disable notifications",
    example: true,
  })
  @IsBoolean()
  notifications: boolean;

  @ApiProperty({
    description: "Preferred language",
    enum: Language,
    example: "en",
  })
  @IsEnum(Language, { message: "language must be en, fr, es, or pt" })
  language: Language;

  @ApiPropertyOptional({
    description: "Enable/disable email notifications",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({
    description: "User timezone",
    example: "America/New_York",
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  timezone?: string;
}

export class ProfileMetadata {
  @ApiProperty({
    description: "User biography",
    minLength: 1,
    maxLength: 160,
    example: "Full-stack developer passionate about TypeScript",
  })
  @IsString()
  @Length(1, 160)
  bio: string;

  @ApiProperty({
    description: "Avatar image URL",
    example: "https://i.pravatar.cc/300",
  })
  @IsUrl({}, { message: "avatar must be a valid URL" })
  avatar: string;

  @ApiProperty({
    description: "Phone number in international format",
    example: "+5577996483728",
  })
  @IsString()
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message:
      "phone number must be in international format starting with + followed by 7-15 digits (e.g., +5577996483728)",
  })
  phone: string;

  @ApiProperty({
    description: "User location/country",
    example: "Brazil",
  })
  @IsString()
  @MinLength(1)
  location: string;

  @ApiProperty({
    description: "Personal website URL",
    example: "https://johndoe.dev",
  })
  @IsUrl({}, { message: "website must be a valid URL" })
  website: string;

  @ApiPropertyOptional({
    description: "Social media profile links",
    type: () => SocialLinksDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  @IsObject()
  socialLinks?: SocialLinksDto;

  @ApiProperty({
    description: "User preferences and settings",
    type: () => PreferencesDto,
  })
  @ValidateNested()
  @Type(() => PreferencesDto)
  @IsObject()
  preferences: PreferencesDto;

  @ApiPropertyOptional({
    description: "Job title or occupation",
    example: "Software Engineer",
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  occupation?: string;

  @ApiPropertyOptional({
    description: "Company name",
    example: "Nvidia",
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  company?: string;

  @ApiPropertyOptional({
    description: "List of technical skills",
    type: [String],
    example: ["TypeScript", "React", "Node.js"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  skills?: string[];
}
