import { Router } from "express";
import dbConfig from "../../../db-connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mysql from "mysql2";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const queryString = "SELECT * FROM Users WHERE username = ?";

  dbConfig.query(queryString, [username], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      res
        .status(500)
        .json({ error: "An error occurred while fetching user data" });
      return;
    }

    if (results.length > 0) {
      const user = results[0]; // Get the first result of the query
      if (bcrypt.compareSync(password, user.passwordHash)) {
        // Correct password, create JWT
        const token = jwt.sign(
          { userId: user.id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else {
        // Incorrect password
        res.status(401).send("Invalid credentials");
      }
    } else {
      // No user found
      res.status(404).send("User not found");
    }
  });
});

// Route for user registration
authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const insertQuery =
    "INSERT INTO Users (username, passwordHash) VALUES (?, ?)";

  dbConfig.query(insertQuery, [username, passwordHash], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      res
        .status(500)
        .json({ error: "An error occurred while creating the user" });
      return;
    }
    res.status(201).send("User created successfully");
  });
});

authRouter.post("/logout", (req, res) => {
  const userId = req.userId; // Assuming you extract the user ID from the request
  // Call the logout method from the Auth model
  Auth.logout(userId, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    // Send a response indicating successful logout
    return res.status(200).json({ message: "Logout successful" });
  });
});

export default authRouter;
