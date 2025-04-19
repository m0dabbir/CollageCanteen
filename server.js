const express = require("express");
const app = express();
const path = require("path");
const port = 3555;
const session = require("express-session");
const { getMenuForCanteen } = require("./utils/menu");

// Middleware to parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: false }));
// Middleware to parse JSON bodies
app.use(express.json());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// --- Session Management ---
app.use(
  session({
    secret: "your-secret-key", // Replace with a strong, random secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production if using HTTPS
  })
);

// Mock user data (replace with database interaction in a real application)
const users = [];
let nextUserId = 1;

// Mock function to check if a user exists (replace with database query)
const findUserByUsername = (username) => {
  return users.find((user) => user.username === username);
};

// Mock function to create a new user (replace with database insertion)
const createUser = (username, password) => {
  const newUser = { id: nextUserId++, username, password }; // In real app, hash password!
  users.push(newUser);
  return newUser;
};

// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
  if (req.session.userId) {
    next(); // User is logged in, proceed
  } else {
    res.redirect(`/login/${req.params.canteenSlug}`);
  }
};

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

// --- Authentication Routes ---
app.get("/login/:canteenSlug", (req, res) => {
  const { canteenSlug } = req.params;
  res.render("login", { canteenSlug, error: null });
});

app.post("/login/:canteenSlug", (req, res) => {
  const { canteenSlug } = req.params;
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("login", {
      canteenSlug,
      error: "Username and password are required.",
    });
  }

  const user = findUserByUsername(username);
  if (user && user.password === password) {
    // In real app, compare hashed passwords!
    req.session.userId = user.id;
    console.log(`User "${username}" logged in for canteen: ${canteenSlug}`);
    res.redirect(`/canteen/${canteenSlug}/menu`);
  } else {
    res.render("login", {
      canteenSlug,
      error: "Invalid username or password.",
    });
  }
});

app.get("/register/:canteenSlug", (req, res) => {
  const { canteenSlug } = req.params;
  res.render("register", { canteenSlug, error: null });
});

app.post("/register/:canteenSlug", (req, res) => {
  const { canteenSlug } = req.params;
  const { username, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.render("register", {
      canteenSlug,
      error: "All fields are required.",
    });
  }

  if (password !== confirmPassword) {
    return res.render("register", {
      canteenSlug,
      error: "Passwords do not match.",
    });
  }

  if (password.length < 6) {
    return res.render("register", {
      canteenSlug,
      error: "Password must be at least 6 characters long.",
    });
  }

  if (findUserByUsername(username)) {
    return res.render("register", {
      canteenSlug,
      error: "Username already exists.",
    });
  }

  const newUser = createUser(username, password); // In real app, hash password before saving
  req.session.userId = newUser.id;
  console.log(`User "${username}" registered.`);
  res.redirect(`/canteen/${canteenSlug}/menu`);
});

app.get("/logout/:canteenSlug", (req, res) => {
  const { canteenSlug } = req.params;
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect(`/login/${canteenSlug}`);
  });
});

// --- Canteen Specific Menu Route (Protected) ---
app.get("/canteen/:canteenSlug/menu", requireLogin, (req, res) => {
  const { canteenSlug } = req.params;
  const menuItems = getMenuForCanteen(canteenSlug);
  res.render("menu", { canteenSlug: canteenSlug, menu: menuItems });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
