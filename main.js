const express = require("express");
const config = require("config");
const sequelize = require("./config/db");
const CookieParser = require("cookie-parser");
const Routes = require("./routes/index.routes");
const requestLogger = require("./middlewares/loggers/requestLogger");
const requestErrorLogger = require("./middlewares/loggers/requestErrorLogger");
const error_handler = require("./middlewares/error/error_handler");

const app = express();

app.use(express.json());
app.use(CookieParser());
app.use(requestLogger);
app.use("/api", Routes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
    path: req.originalUrl,
  });
});

app.use(requestErrorLogger);

app.use(error_handler)

const PORT = config.get("PORT") || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync({ alter: true });
    console.log("📦 All models synced");

    app.listen(PORT, () =>
      console.log(`🚀 Server started at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Error starting the server:", error);
  }
}

start();