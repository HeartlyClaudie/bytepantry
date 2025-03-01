const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  server: process.env.DATABASE_SERVER,
  database: process.env.DATABASE_NAME,
  options: { encrypt: true, enableArithAbort: true },
};

// Azure Function to Fetch Pantry Items
module.exports = async function (context, req) {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM FoodItem");

    context.res = {
      status: 200,
      body: result.recordset,
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: { error: "Error retrieving pantry data", details: error.message },
    };
  }
};
