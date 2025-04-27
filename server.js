const express = require("express");
const app = express();
const path = require("path");
const port = 3555;
const session = require("express-session");
const { getMenuForCanteen } = require("./utils/menuList");

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
/*

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
*/
function findUserByUsername(username, callback) {
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return callback(err, null);
      if (results.length > 0) {
        callback(null, results[0]);
      } else {
        callback(null, null);
      }
    }
  );
}
function createUser(username, password, canteenId, callback) {
  const sql =
    "INSERT INTO users (username, password, canteen_id) VALUES (?, ?, ?)";
  db.query(sql, [username, password, canteenId], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result.insertId); // returns the new user ID
  });
}

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

const bcrypt = require("bcrypt"); // for password hashing (important!)

app.post("/login/:canteenSlug", (req, res) => {
  const { canteenSlug } = req.params;
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render("login", {
      canteenSlug,
      error: "Username and password are required.",
    });
  }

  // Check if the user exists in the database
  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, userResults) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Server error");
      }

      if (userResults.length === 0) {
        return res.render("login", {
          canteenSlug,
          error: "Invalid username or password.",
        });
      }

      const user = userResults[0];

      // Compare the entered password with the hashed password in the database
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).send("Server error");
        }

        if (isMatch) {
          // Password is correct, set the session
          req.session.userId = user.id;
          console.log(
            `User "${username}" logged in for canteen: ${canteenSlug}`
          );
          res.redirect(`/canteen/${canteenSlug}/menu`);
        } else {
          // Incorrect password
          res.render("login", {
            canteenSlug,
            error: "Invalid username or password.",
          });
        }
      });
    }
  );
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

  // First, find the canteen ID based on the slug
  db.query(
    "SELECT id FROM canteens WHERE slug = ?",
    [canteenSlug],
    (err, canteenResults) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Server error");
      }

      if (canteenResults.length === 0) {
        return res.status(404).send("Canteen not found");
      }

      const canteenId = canteenResults[0].id;

      // Check if username already exists
      db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, userResults) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).send("Server error");
          }

          if (userResults.length > 0) {
            return res.render("register", {
              canteenSlug,
              error: "Username already exists.",
            });
          }

          // If not, hash the password and insert new user
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
              console.error("Error hashing password:", err);
              return res.status(500).send("Server error");
            }

            db.query(
              "INSERT INTO users (username, password, canteen_id) VALUES (?, ?, ?)",
              [username, hashedPassword, canteenId],
              (err, insertResult) => {
                if (err) {
                  console.error("Database error:", err);
                  return res.status(500).send("Server error");
                }

                // Set session after successful registration
                req.session.userId = insertResult.insertId;
                console.log(`User "${username}" registered successfully.`);
                res.redirect(`/canteen/${canteenSlug}/menu`);
              }
            );
          });
        }
      );
    }
  );
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

//--Database--
let mysql = require("mysql");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "modabbir123",
  database: "StudentsFET",
});

db.connect((err) => {
  if (err) throw err;
  else console.log("Connected to Database\n");
});
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
