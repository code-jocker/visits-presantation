import sequelize from "../config/database";
import "../models/index"; // Import models to register them with sequelize

const syncDatabase = async () => {
    try {
        console.log("Starting database synchronization...");

        // Ensure connection is established
        await sequelize.authenticate();
        console.log("Database connection established.");

        // Run sync with alter: true (adds/updates columns in existing tables)
        await sequelize.sync({ alter: true });
        console.log("Database synchronized successfully.");

        // Helpful verification for the reported issue
        try {
            const cols: any[] = await sequelize.query(
                `SELECT column_name FROM information_schema.columns WHERE table_name='visitors' AND table_schema='public' ORDER BY ordinal_position;`,
            );
            // sequelize.query returns different shapes depending on driver; normalize
            const rows = Array.isArray(cols) ? cols : (cols as any)?.[0];
            const colNames = (rows || []).map((r: any) => r.column_name).filter(Boolean);
            console.log("visitors columns:", colNames);
        } catch (verifyErr) {
            console.warn("Column verification skipped:", (verifyErr as any)?.message || verifyErr);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error synchronizing database:", error);
        process.exit(1);
    }
};

syncDatabase();

