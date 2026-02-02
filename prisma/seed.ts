import { hashPassword } from "@/lib/auth";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config"; // Add this to load env vars

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the adapter
const adapter = new PrismaPg(pool);

// Pass adapter to PrismaClient
const prisma = new PrismaClient({ adapter });

const main = async () => {
  console.log("Starting database seed...");
  
  // Create teams (keep your existing code)
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "Engineering",
        description: "Software development team",
        code: "ENG-2024",
      },
    }),
    prisma.team.create({
      data: {
        name: "Design",
        description: "UI/UX and visual design team",
        code: "DES-2024",
      },
    }),
    prisma.team.create({
      data: {
        name: "Marketing",
        description: "Growth, branding, and outreach team",
        code: "MKT-2024",
      },
    }),
  ]);

  
  const sampleUsers = [
    {
      name: "John Developer",
      email: "john@company.com",
      team: teams[0]
    },
    {
      name: "Jane Designer",
      email: "jane@company.com",
      team: teams[0], 
      role: Role.USER,
    },
    {
      name: "Bob Marketer",
      email: "bob@company.com",
      team: teams[1], 
      role: Role.MANAGER,
    },
    {
      name: "Alice Sales",
      email: "alice@company.com",
      team: teams[1], 
      role: Role.USER,
    },
  ];

  for (const userData of sampleUsers) {
    await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: await hashPassword("123456"),
        role: userData.role,
        teamId: userData.team.id,
      },
    });
  }

  console.log("Database seeded successfully");
};

main()
  .catch((e) => {
    console.error("seeding failed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Close the PG pool
  });