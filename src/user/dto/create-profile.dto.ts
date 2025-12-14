import { Type } from "class-transformer";
import { ProfileMetadata } from "./profile-metadata.dto";
import { IsObject, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProfileDto {
  @ApiProperty({
    description: "User profile metadata containing all profile information",
    type: () => ProfileMetadata,
    example: {
      bio: "Full-stack developer passionate about TypeScript",
      avatar: "https://i.pravatar.cc/300",
      phone: "+5577996483728",
      location: "Brazil",
      website: "https://johndoe.dev",
      socialLinks: {
        twitter: "https://twitter.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
      },
      preferences: {
        theme: "dark",
        notifications: true,
        language: "en",
        emailNotifications: true,
        timezone: "America/New_York",
      },
      occupation: "Software Engineer",
      company: "Nvidia",
      skills: ["TypeScript", "React", "Node.js"],
    },
  })
  @ValidateNested()
  @Type(() => ProfileMetadata)
  @IsObject()
  metadata: ProfileMetadata;
}
