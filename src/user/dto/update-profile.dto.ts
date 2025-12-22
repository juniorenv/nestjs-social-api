import { ApiPropertyOptional } from "@nestjs/swagger";
import { OmitType, PartialType } from "@nestjs/swagger";
import {
  PreferencesDto,
  ProfileMetadata,
  SocialLinksDto,
} from "./profile-metadata.dto";
import { IsObject, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { AtLeastOneField } from "src/common/decorators/at-least-one-property.decorator";

export class UpdatePreferencesDto extends PartialType(PreferencesDto) {}
export class UpdateSocialLinksDto extends PartialType(SocialLinksDto) {}

export class UpdateProfileMetadataDto extends PartialType(
  OmitType(ProfileMetadata, ["preferences", "socialLinks"] as const),
) {
  @ApiPropertyOptional({
    description: "User preferences (theme, language, notifications)",
    type: UpdatePreferencesDto,
    example: {
      theme: "light",
      notifications: false,
      language: "pt",
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePreferencesDto)
  @IsObject()
  preferences?: UpdatePreferencesDto;

  @ApiPropertyOptional({
    description: "Social media links",
    type: UpdateSocialLinksDto,
    example: {
      twitter: "https://twitter.com/newhandle",
      github: "https://github.com/newusername",
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSocialLinksDto)
  @IsObject()
  socialLinks?: UpdateSocialLinksDto;
}

@AtLeastOneField(["metadata"])
export class UpdateProfileDto {
  @ApiPropertyOptional({
    description:
      "Profile metadata to update. Only provided fields will be updated (deep merge).",
    type: UpdateProfileMetadataDto,
    example: {
      bio: "Updated bio text",
      location: "United States",
      preferences: {
        theme: "light",
        language: "en",
      },
      skills: ["Java", "Typescript", "Golang"],
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateProfileMetadataDto)
  @IsObject()
  metadata?: UpdateProfileMetadataDto;
}
