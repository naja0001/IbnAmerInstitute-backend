import { Router } from "express";
import dbConfig from "../../../db-connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mysql from "mysql2";

import { authController } from "../../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body; // Destructure email and password from req.body
  const sql = "SELECT * from login Where email = ? and password = ?";
  console.log("SQL Query:", sql);
  // Pass email and password directly as an array to dbConfig.query
  dbConfig.query(sql, [email, password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "teachers", email: email },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const insertQuery =
      "INSERT INTO Users (username, passwordHash) VALUES (?, ?)";

    dbConfig.query(insertQuery, [username, passwordHash], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ error: "An error occurred while creating the user" });
      }
      res.status(201).send("User created successfully");
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Server error during registration");
  }
});

authRouter.get("/logout", (req, res) => {
  console.log("Logout route hit");
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    path: "/",
  });
  res.status(200).json({ status: "Success", message: "Logout successful" });
});

export default authRouter;
