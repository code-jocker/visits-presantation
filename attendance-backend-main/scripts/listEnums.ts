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
    const [rows] = await sequelize.query("SELECT typname FROM pg_type WHERE typtype = 'e' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')");
    console.log("Enum types:", rows);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
  await sequelize.close();
})().catch((e) => { console.error(e); process.exit(1); });
