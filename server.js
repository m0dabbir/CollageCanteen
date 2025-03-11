const express = require("express");
const app = express();
const path = require("path");
const port = 3555;

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/canteens", (req, res) => {
  res.render("canteens");
});

app.get("/stationary", (req, res) => {
  res.render("stationary");
});

app.get("/tender", (req, res) => {
  res.render("tender");
});

app.get("/loginfet", (req, res) => {
  res.render("loginfet");
});

app.get("/logincentral", (req, res) => {
  res.render("logincentral");
});

app.get("/logincastro", (req, res) => {
  res.render("logincastro");
});

app.get("/loginlaw", (req, res) => {
  res.render("loginlaw");
});

app.get("/loginarchitecture", (req, res) => {
  res.render("loginarchitecture");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
