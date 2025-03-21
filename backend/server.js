require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const path = require("path");
const sql = require("mssql");
const { expressjwt: expressJwt } = require("express-jwt");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://bytepantry-api.azurewebsites.net",
  "https://localhost"
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Azure SQL Database Configuration
const dbConfig = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_NAME,
  options: {
    encrypt: true, // Required for Azure
    enableArithAbort: true,
  },
};

// Connect to Azure SQL
const connectDB = async () => {
  try {
    await sql.connect(dbConfig);
    console.log("✅ Connected to Azure SQL Database!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};
connectDB();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ userID: user.userID, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY || "1h",
  });
};

// Secure Routes Middleware
const authenticateJWT = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

// 📌 Register New User (POST /auth/register)
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) return res.status(400).json({ error: "All fields are required." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql.query(
      `INSERT INTO Users (name, email, password) VALUES ('${name}', '${email}', '${hashedPassword}')`
    );
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Server error registering user.");
  }
});

// 📌 User Login & Get Token (POST /auth/login)
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) return res.status(400).json({ error: "Email and password required." });

  try {
    const result = await sql.query(`SELECT * FROM Users WHERE email='${email}'`);
    if (result.recordset.length === 0) return res.status(401).json({ error: "Invalid credentials." });

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

    const token = generateToken(user);
    res.json({ token, userID: user.userID });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Server error logging in.");
  }
});

// 📌 Secure Route: Get Pantry Items (GET /api/pantry)
app.get("/api/pantry", authenticateJWT, async (req, res) => {
  try {
    const result = await sql.query(`SELECT * FROM FoodItem WHERE pantryID IN (SELECT pantryID FROM Pantry WHERE userID=${req.auth.userID})`);
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching pantry items:", error);
    res.status(500).send("Server error fetching pantry data.");
  }
});

// 📌 Secure Route: Add Pantry Item (POST /api/pantry)
app.post("/api/pantry", authenticateJWT, async (req, res) => {
  const { name, category, barcode, expiryDate, pantryID } = req.body;

  if (!name || !pantryID) {
    return res.status(400).json({ error: "Name and pantryID are required." });
  }

  try {
    await sql.query(
      `INSERT INTO FoodItem (name, category, barcode, expiryDate, pantryID) 
       VALUES ('${name}', '${category}', '${barcode}', '${expiryDate}', ${pantryID})`
    );
    res.status(201).json({ message: "Food item added successfully!" });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).send("Server error adding food item.");
  }
});

// 📌 Secure Route: Fetch User Notifications (GET /api/notifications)
app.get("/api/notifications", authenticateJWT, async (req, res) => {
  try {
    const result = await sql.query(
      `SELECT * FROM Notification WHERE userID=${req.auth.userID}`
    );
    res.json(result.recordset);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Server error fetching notifications.");
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
  console.log(`🚀 Server is running on port ${PORT}`);
});
