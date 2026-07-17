const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDatabase = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

dotenv.config();

connectDatabase();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://help-desk-ticket-system-puce.vercel.app",
  process.env.CLIENT_URL?.trim(),
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Allows requests from Postman, Render health checks, and similar tools.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error(`CORS blocked origin: ${origin}`);

    return callback(
      new Error(`Origin ${origin} is not allowed by CORS`)
    );
  },
  credentials: true,
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (request, response) => {
  response.json({
    message: "IT Help Desk API is running",
  });
});

app.get("/api/health", (request, response) => {
  response.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

app.use((request, response) => {
  response.status(404).json({
    message: "Route not found",
  });
});

app.use((error, request, response, next) => {
  console.error(error);

  response.status(500).json({
    message:
      error.message ||
      "An unexpected server error occurred",
  });
});

const port = process.env.PORT || 5000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});