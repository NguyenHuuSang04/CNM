require("dotenv").config();
const { ensureProductsTable } = require("../config/dynamodb");

(async () => {
  try {
    await ensureProductsTable();
    console.log("Database initialization complete.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to initialize table:", error.message);
    process.exit(1);
  }
})();
