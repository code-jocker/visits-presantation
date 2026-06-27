import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  logging: false,
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
});

(async () => {
  await sequelize.authenticate();
  console.log("connected");
  try {
    await sequelize.query("ALTER TYPE \"enum_visitors_idProofType\" ADD VALUE 'NATIONAL_ID'");
    console.log("✅ Added NATIONAL_ID");
  } catch (e: any) {
    console.error("Error:", e.message);
  }
  await sequelize.close();
})().catch((e) => { console.error(e); process.exit(1); });
