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
  await sequelize.authenticate();
  console.log("Connected");

  const [classes]: any = await sequelize.query("SELECT id, name FROM classes ORDER BY name");
  console.log("Classes:", JSON.stringify(classes, null, 2));

  const [students]: any = await sequelize.query("SELECT id, studentId, fullName, classId FROM students ORDER BY fullName");
  console.log("Students count:", students.length);
  console.log("Sample students:", JSON.stringify(students.slice(0, 10), null, 2));

  await sequelize.close();
}

run().catch(console.error);
