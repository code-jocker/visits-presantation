import config from "./config/config";
import app from "./server";

const host = config.host || "0.0.0.0";
const port = config.port;

const server = app.listen(port, host, () => {
    const { nodeEnv } = config;
    console.log(`Server running in ${nodeEnv} mode on port http://${host}:${port}`);

    if (process.env.SEED_ON_START === "true") {
        import("./scripts/seed-students").then(() => {
            console.log("🌱 Seeded student data on startup.");
        }).catch((err) => {
            console.error("❌ Seed on start failed:", err);
        });
    }
});

const onCloseSignal = () => {
    console.log("Received shutdown signal, closing server...");
    server.close(() => {
        console.log("Server closed gracefully.");
        process.exit(0);
    });
    setTimeout(() => {
        console.log("Forcefully shutting down server.");
        process.exit(1);
    }, 5000).unref();
};
process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
