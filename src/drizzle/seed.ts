import "dotenv/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/schema";
import { faker } from "@faker-js/faker";
import { hashSync } from "bcrypt";
import { Language, Theme } from "../user/dto/profile-metadata.dto";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

function extractIds<T extends { id: string }>(arr: T[]): string[] {
  return arr.map((value) => value.id);
}

async function cleanupDatabase() {
  console.log("🧹 Cleaning up existing data...");
  try {
    await db.execute(`
        TRUNCATE TABLE 
        users_to_groups,
        comments,
        posts,
        profile_info,
        groups,
        users
      CASCADE;
    `);

    console.log("✅ Cleanup complete", "\n");
  } catch (error) {
    console.error("⚠️  Cleanup warning:", error);
  }
}

async function main() {
  try {
    console.log("🌱 Starting seed...", "\n");

    await cleanupDatabase();

    console.log("👥 Creating users...");
    const usersData = Array(50)
      .fill("")
      .map(() => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashSync(faker.internet.password(), 10),
      }));

    const insertedUsers = await db
      .insert(schema.users)
      .values(usersData)
      .returning();
    const userIds = extractIds(insertedUsers);
    console.log(`✅ Created ${userIds.length} users`);

    console.log("📋 Creating profile info...");
    const profilesData = userIds.map((userId) => ({
      userId,
      metadata: {
        bio: faker.person.bio(),
        avatar: faker.image.avatar(),
        phone: faker.phone.number(),
        location: faker.location.country(),
        website: faker.internet.url(),
        socialLinks: {
          twitter: faker.internet.url(),
          linkedin: faker.internet.url(),
          github: faker.internet.url(),
        },
        preferences: {
          theme: faker.helpers.arrayElement(Object.values(Theme)),
          notifications: faker.datatype.boolean(),
          language: faker.helpers.arrayElement(Object.values(Language)),
          emailNotifications: faker.datatype.boolean(),
          timezone: faker.location.timeZone(),
        },
        occupation: faker.person.jobTitle(),
        company: faker.company.name(),
        skills: faker.helpers.arrayElements(
          ["TypeScript", "React", "Node.js", "Python", "Go", "Rust"],
          { min: 2, max: 4 },
        ),
      },
    }));

    const insertedProfiles = await db
      .insert(schema.profileInfo)
      .values(profilesData)
      .returning();
    const profileIds = extractIds(insertedProfiles);
    console.log(`✅ Created ${profileIds.length} profile info records`);

    console.log("📝 Creating posts...");
    const postsData = Array(50)
      .fill("")
      .map(() => ({
        content: faker.lorem.paragraph(),
        title: faker.lorem.sentence(),
        authorId: faker.helpers.arrayElement(userIds),
      }));

    const insertedPosts = await db
      .insert(schema.posts)
      .values(postsData)
      .returning();
    const postIds = extractIds(insertedPosts);
    console.log(`✅ Created ${postIds.length} posts`);

    console.log("💬 Creating comments...");

    const commentsData = Array(50)
      .fill("")
      .map(() => ({
        authorId: faker.helpers.arrayElement(userIds),
        postId: faker.helpers.arrayElement(postIds),
        text: faker.lorem.sentence(),
      }));

    const insertedComments = await db
      .insert(schema.comments)
      .values(commentsData)
      .returning();
    const commentIds = extractIds(insertedComments);
    console.log(`✅ Created ${commentIds.length} comments`);

    console.log("🏘️  Creating groups...");
    const insertedGroups = await db
      .insert(schema.groups)
      .values([
        {
          name: "TypeScript",
          description: "TS community",
          createdById: userIds[0],
        },
        {
          name: "Rust",
          description: "Rust community",
          createdById: userIds[1],
        },
        { name: "GO", description: "Go community", createdById: userIds[2] },
      ])
      .onConflictDoNothing()
      .returning();
    const groupIds = extractIds(insertedGroups);
    console.log(`✅ Created ${groupIds.length} groups`);

    if (groupIds.length === 0) {
      throw new Error(
        "❌ No groups created, cannot create user-group relationships",
      );
    }

    console.log("🔗 Creating user-group relationships...");
    const usersToGroupsData = userIds.map((userId) => ({
      userId,
      groupId: faker.helpers.arrayElement(groupIds),
    }));
    await db.insert(schema.usersToGroups).values(usersToGroupsData).returning();
    console.log(`✅ Created user-group relationships`);

    console.log("✨ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
