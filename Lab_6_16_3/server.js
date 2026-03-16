require("dotenv").config();
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const productRoutes = require("./routes/productRoutes");
const { ensureProductsTable } = require("./config/dynamodb");

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "lab6-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.successMessages = req.flash("success");
  res.locals.errorMessages = req.flash("error");
  next();
});

app.use(productRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).render("partials/error", {
    message: error.message || "Có lỗi xảy ra trên máy chủ.",
  });
});

(async () => {
  try {
    await ensureProductsTable();
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to DynamoDB Local:", error.message);
    process.exit(1);
  }
})();
