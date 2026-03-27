require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/tickets", require("./routes/ticket.route"));
app.get("/", (_req, res) => res.redirect("/tickets"));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
