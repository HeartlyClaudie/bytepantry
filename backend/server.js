require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const sql = require("mssql");
const { expressjwt: expressJwt } = require("express-jwt");

const app = express();
const PORT = process.env.PORT || 8181;

// ✅ Ensure required environment variables are set
const requiredEnvVars = ["DATABASE_USER", "DATABASE_PASSWORD", "DATABASE_SERVER", "DATABASE_NAME", "JWT_SECRET"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.warn(`⚠️ Warning: Missing environment variable ${varName}`);
  }
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "https://bytepantry-api.azurewebsites.net"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Azure SQL Database Configuration
const dbConfig = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_NAME,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

// ✅ Connect to Azure SQL
const poolPromise = sql.connect(dbConfig)
  .then((pool) => {
    console.log("✅ Connected to Azure SQL Database!");
    return pool;
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });

// ✅ Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ userID: user.userID, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY || "1h",
  });
};

// ✅ Secure Routes Middleware (Allow public access to "/", "/auth/b2c-login")
const authenticateJWT = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
}).unless({ path: ["/", "/auth/b2c-login"] });

app.use(authenticateJWT);

// ✅ Handle Unauthorized Requests
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    console.warn(`🚨 Unauthorized Access Attempt on ${req.path}`);
    return res.status(401).json({ error: "Unauthorized: Invalid or missing token." });
  }
  next();
});

// ✅ Handle B2C Login (Check if user exists or insert new user)
app.post("/auth/b2c-login", async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required." });

    const pool = await poolPromise;
    const result = await pool.request().input("email", sql.NVarChar, email).query("SELECT userID FROM Users WHERE email=@email");

    let userID;
    if (result.recordset.length === 0) {
      const insertResult = await pool
        .request()
        .input("name", sql.NVarChar, name || "New User")
        .input("email", sql.NVarChar, email)
        .query("INSERT INTO Users (name, email) OUTPUT INSERTED.userID VALUES (@name, @email)");

      userID = insertResult.recordset[0].userID;
    } else {
      userID = result.recordset[0].userID;
    }

    const token = generateToken({ userID, email });
    res.json({ token, userID, email });
  } catch (error) {
    console.error("❌ Error handling B2C login:", error);
    res.status(500).send("Server error handling B2C login.");
  }
});

// ✅ Secure Route: Fetch Pantry Items
app.get("/api/pantry", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("userID", sql.Int, req.auth.userID)
      .query("SELECT * FROM FoodItem WHERE pantryID IN (SELECT pantryID FROM Pantry WHERE userID=@userID)");

    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error fetching pantry items:", error);
    res.status(500).send("Server error fetching pantry data.");
  }
});

// Serve frontend build files
app.use(express.static(path.join(__dirname, "../frontend/build")));

// Serve index.html for all non-API routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// Start the Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
