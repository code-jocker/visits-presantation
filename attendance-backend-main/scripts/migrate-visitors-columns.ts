import sequelize from "../config/database";
import "../models/index";

const run = async () => {
  // Prefer DATABASE_URL, but allow local config fallback.
  await sequelize.authenticate();


  const dialect = (sequelize.getDialect && sequelize.getDialect()) || "";
  // eslint-disable-next-line no-console
  console.log("migrate-visitors-columns dialect:", dialect);

  // MySQL/MariaDB: no IF NOT EXISTS support for ADD COLUMN in many versions.
  // We first check existing columns via SHOW COLUMNS.
  const tableName = "visitors";
  const required: Array<{ name: string; mysqlType: string; pgType: string }> = [
    { name: "passType", mysqlType: "VARCHAR(255)", pgType: "VARCHAR(255)" },
    { name: "profilePhoto", mysqlType: "LONGBLOB", pgType: "BYTEA" },
    { name: "exitTime", mysqlType: "TIMESTAMP NULL", pgType: "TIMESTAMP WITH TIME ZONE" },
    { name: "deletedAt", mysqlType: "TIMESTAMP NULL", pgType: "TIMESTAMP WITH TIME ZONE" },
  ];

  const existingColumns = new Set<string>();

  if (dialect === "mysql" || dialect === "mariadb") {
    const [rows]: any = await sequelize.query(`SHOW COLUMNS FROM \`${tableName}\``);
    for (const r of rows || []) {
      if (r?.Field) existingColumns.add(String(r.Field));
    }

    for (const col of required) {
      if (!existingColumns.has(col.name)) {
        const sql = `ALTER TABLE \`${tableName}\` ADD COLUMN \`${col.name}\` ${col.mysqlType};`;
        // eslint-disable-next-line no-console
        console.log("Executing:", sql);
        await sequelize.query(sql);
      }
    }
  } else {
    // Postgres fallback (Render may still run postgres in other envs)
    for (const col of required) {
      const sql = `ALTER TABLE "${tableName}" ADD COLUMN IF NOT EXISTS "${col.name}" ${col.pgType};`;
      // eslint-disable-next-line no-console
      console.log("Executing:", sql);
      await sequelize.query(sql);
    }
  }


  // eslint-disable-next-line no-console
  console.log("visitors columns migration completed successfully.");

  await sequelize.close();
};

run()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error("migrate-visitors-columns failed:", e);
    process.exit(1);
  });

