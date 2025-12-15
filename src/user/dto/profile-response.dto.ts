import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponseDto {
  @ApiProperty({
    description: "Profile unique identifier",
    example: "789e4567-e89b-12d3-a456-426614174222",
  })
  id: string;

  @ApiProperty({
    description: "Profile metadata",
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
  metadata: object;

  @ApiProperty({
    description: "Profile creation timestamp",
    example: "2025-12-14T10:30:00.000Z",
  })
  createdAt: Date;

  @ApiProperty({
    description: "Profile last update timestamp",
    example: "2025-12-14T10:30:00.000Z",
  })
  updatedAt: Date;

  @ApiProperty({
    description: "User ID this profile belongs to",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  userId: string;
}
