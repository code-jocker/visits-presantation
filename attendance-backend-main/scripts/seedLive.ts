import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://evisitors_user:RK0uvG8ZSkHH551BH2GZ7YWqtE25q37l@dpg-d8h6vtddt1ts7383hlu0-a.oregon-postgres.render.com/evisitors";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

(async () => {
  const { default: Visitor } = await import("../models/visitor.ts");

  await sequelize.authenticate();
  console.log("✅ Connected to live database");

  const now = new Date();

  const visitors = [
    { fullName: "Shyakaclever Prince", mobile: "250728704569", department: "ICT", idProofType: "NATIONAL_ID", status: "CHECKED_IN" as const, badgeId: "V-224985" },
    { fullName: "Alice Uwimana", mobile: "250788123456", department: "HR", idProofType: "NATIONAL_ID", status: "CHECKED_OUT" as const, badgeId: "V-224986" },
    { fullName: "Bob Mugisha", mobile: "250799654321", department: "Finance", idProofType: "PASSPORT", status: "ACTIVE" as const, badgeId: "V-224987" },
    { fullName: "Claire Iradukunda", mobile: "250722987654", department: "ICT", idProofType: "DRIVING_LICENSE", status: "CHECKED_IN" as const, badgeId: "V-224988" },
    { fullName: "David Nkurunziza", mobile: "250783456789", department: "Operations", idProofType: "AADHAR", status: "BLACKLISTED" as const, badgeId: "V-224989" },
  ];

  for (const v of visitors) {
    await Visitor.create({
      ...v,
      entryTime: now,
      createdAt: now,
      updatedAt: now,
    } as any);
    console.log(`✅ Seeded visitor: ${v.fullName}`);
  }

  console.log("🎉 Seeding complete");
  await sequelize.close();
})().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
