import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "evisitors",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || "3307"),
    dialect: "mysql",
    logging: false,
  },
);

async function run() {
  const { default: Visitor } = await import("../models/visitor");

  await sequelize.authenticate();
  console.log("✅ Connected to MySQL database");

  const now = new Date();

  const visitors = [
    { fullName: "Shyakaclever Prince", studentName: "Prince Student", mobile: "250728704569", department: "ICT", idProofType: "NATIONAL_ID", status: "CHECKED_IN", badgeId: "V-224985" },
    { fullName: "Alice Uwimana", studentName: "Alice Student", mobile: "250788123456", department: "HR", idProofType: "NATIONAL_ID", status: "CHECKED_OUT", badgeId: "V-224986" },
    { fullName: "Bob Mugisha", studentName: "Bob Student", mobile: "250799654321", department: "Finance", idProofType: "PASSPORT", status: "ACTIVE", badgeId: "V-224987" },
    { fullName: "Claire Iradukunda", studentName: "Claire Student", mobile: "250722987654", department: "ICT", idProofType: "DRIVING_LICENSE", status: "CHECKED_IN", badgeId: "V-224988" },
    { fullName: "David Nkurunziza", studentName: "David Student", mobile: "250783456789", department: "Operations", idProofType: "AADHAR", status: "BLACKLISTED", badgeId: "V-224989" },
  ];

  for (const v of visitors) {
    await Visitor.create({
      ...v,
      entryTime: now,
      createdAt: now,
      updatedAt: now,
    } as any);
    console.log(`✅ Seeded visitor: ${v.fullName} (student: ${v.studentName})`);
  }

  console.log("🎉 Seeding complete");
  await sequelize.close();
}

run().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
