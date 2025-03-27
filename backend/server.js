// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8080;

// CORS Configuration
const allowedOrigins = [
  "https://bytepantry-web-g2gbhufnh7awbmaf.canadacentral-01.azurewebsites.net",
  "http://localhost:3000"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("CORS blocked origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Azure SQL Configuration
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

const poolPromise = sql.connect(dbConfig)
  .then(pool => {
    console.log("Connected to Azure SQL");
    return pool;
  })
  .catch(err => {
    console.error("DB Connection Error:", err);
  });

// JWT Middleware with public.pem
const publicKey = process.env.PUBLIC_PEM.replace(/\\n/g, '\n');

app.use((req, res, next) => {
  if (req.method === "OPTIONS" || req.path === "/" || req.path === "/auth/b2c-login") {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  console.log("Incoming Authorization:", authHeader);

  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });
    console.log("Token verified:", decoded);
    req.auth = decoded;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    console.error("Token:", token);
    return res.status(401).json({ error: "Unauthorized" });
  }
});

// Error handler
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

app.post("/auth/b2c-login", async (req, res) => {
  const { email, name } = req.body;

  console.log("Incoming login request:", req.body);

  if (!email) {
    console.warn("Missing email in request");
    return res.status(400).json({ error: "Email is required." });
  }

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("email", sql.NVarChar, email)
      .query("SELECT userID FROM Users WHERE email = @email");

    let userID;

    if (result.recordset.length === 0) {
      console.log("User does not exist. Creating new user...");

      const insertUser = await pool.request()
        .input("name", sql.NVarChar, name || "New User")
        .input("email", sql.NVarChar, email)
        .query(`
          INSERT INTO Users (name, email)
          OUTPUT INSERTED.userID
          VALUES (@name, @email)
        `);

      userID = insertUser.recordset[0].userID;

      console.log(`New user created with ID ${userID}. Creating pantry...`);

      await pool.request()
        .input("userID", sql.Int, userID)
        .query("INSERT INTO Pantry (userID) VALUES (@userID)");

      console.log("Pantry created.");
    } else {
      userID = result.recordset[0].userID;
      console.log(`Existing user found with ID ${userID}`);
    }

    res.json({ userID, email });

  } catch (error) {
    console.error("Error in B2C login handler:");
    console.error("Error message:", error.message);
    if (error.precedingErrors) console.error("SQL preceding errors:", error.precedingErrors);
    console.error(error.stack);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/pantry", async (req, res) => {
  try {
    const userID = parseInt(req.query.userID, 10);
    if (isNaN(userID)) return res.status(400).json({ error: "Invalid userID" });

    const pool = await poolPromise;
    const result = await pool.request()
      .input("userID", sql.Int, userID)
      .query("SELECT * FROM FoodItem WHERE pantryID IN (SELECT pantryID FROM Pantry WHERE userID = @userID)");

    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/pantry/add", async (req, res) => {
  const { foodName, category, expiryDate, quantity, userID } = req.body;

  console.log("Decoded auth:", req.auth);
  console.log("Raw userID from body:", userID);

  const parsedUserID = parseInt(userID, 10);
  if (isNaN(parsedUserID)) {
    console.error("Invalid userID from client:", userID);
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  try {
    console.log("Adding item for userID:", parsedUserID);
    console.log("Payload to DB:", { foodName, category, expiryDate, quantity });

    const pool = await poolPromise;

    const pantryResult = await pool.request()
      .input("userID", sql.Int, parsedUserID)
      .query("SELECT pantryID FROM Pantry WHERE userID = @userID");

    if (pantryResult.recordset.length === 0) {
      return res.status(404).json({ error: "Pantry not found for user." });
    }

    const pantryID = pantryResult.recordset[0].pantryID;
    console.log("pantryID:", pantryID);

    await pool.request()
      .input("pantryID", sql.Int, pantryID)
      .input("foodName", sql.NVarChar, foodName)
      .input("category", sql.NVarChar, category)
      .input("expiryDate", sql.Date, expiryDate)
      .input("quantity", sql.Int, quantity)
      .query(`
        INSERT INTO FoodItem (pantryID, name, category, expiryDate, quantity)
        VALUES (@pantryID, @foodName, @category, @expiryDate, @quantity)
      `);

    res.json({ success: true });

  } catch (error) {
    console.error("Error adding item:", error.message);
    console.error(error.stack);
    res.status(500).json({ error: "Failed to add item." });
  }
});

// fetch profile
app.get("/api/user/profile", async (req, res) => {
  try {
    const userID = parseInt(req.query.userID, 10);
    if (isNaN(userID)) return res.status(400).json({ error: "Invalid userID" });

    const pool = await poolPromise;
    const result = await pool.request()
      .input("userID", sql.Int, userID)
      .query(`
        SELECT name, email, pushNotif, emailUpdates, created_at
        FROM Users
        WHERE userID = @userID
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update profile
app.put("/api/user/profile", async (req, res) => {
  const { userID, name, pushNotif, emailUpdates } = req.body;

  if (!userID || !name) {
    return res.status(400).json({ error: "Missing userID or name" });
  }

  try {
    const pool = await poolPromise;

    await pool.request()
      .input("userID", sql.Int, userID)
      .input("name", sql.NVarChar, name)
      .input("pushNotif", sql.Bit, pushNotif ? 1 : 0)
      .input("emailUpdates", sql.Bit, emailUpdates ? 1 : 0)
      .query(`
        UPDATE Users
        SET name = @name, pushNotif = @pushNotif, emailUpdates = @emailUpdates
        WHERE userID = @userID
      `);

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Root route to avoid "Cannot GET /"
app.get("/", (req, res) => {
  res.send("BytePantry API is running.");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`BytePantry API listening on port ${PORT}`);
});
