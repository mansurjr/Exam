const express = require("express");
const config = require("config");
const sequelize = require("./config/db");
const CookieParser = require("cookie-parser");
const Routes = require("./routes/index.routes");

const app = express();

app.use(express.json());
app.use(CookieParser());
app.use("/api", Routes);

const PORT = config.get("PORT") || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("📦 All models synced");

    app.listen(PORT, () =>
      console.log(
        `🚀 Server started at http://localhost:${PORT}\nPress CTRL + C to stop the process`
      )
    );
  } catch (error) {
    console.error("❌ Error starting the server:", error);
  }
}

start();
