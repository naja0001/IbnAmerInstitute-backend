import { Router } from "express";
import dbConfig from "../../../db-connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mysql from "mysql2";

import { authController } from "../../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM login WHERE email = ?";

  dbConfig.query(sql, [email], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ loginStatus: false, Error: "Database query error" });
    }

    if (result.length > 0) {
      const user = result[0];
      bcrypt.compare(password, user.passwordHash, (err, isMatch) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            loginStatus: false,
            Error: "Error verifying password",
          });
        }
        if (isMatch) {
          const token = jwt.sign(
            { role: "teachers", email: user.email },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token, { httpOnly: true });
          return res.json({ loginStatus: true });
        } else {
          return res.status(401).json({
            loginStatus: false,
            Error: "Incorrect credentials",
          });
        }
      });
    } else {
      return res
        .status(401)
        .json({ loginStatus: false, Error: "User not found" });
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
