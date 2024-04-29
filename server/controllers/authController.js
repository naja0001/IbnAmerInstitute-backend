import userModel from "../models/authModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const authController = {
  login: async function (req, res) {
    const { email, password } = req.body;
    try {
      const result = await userModel.findUserByEmail(email);
      if (result.length > 0) {
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (isMatch) {
          const token = jwt.sign(
            { role: "teachers", email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
          res.cookie("token", token, { httpOnly: true });
          res.json({ loginStatus: true });
        } else {
          res.json({ loginStatus: false, Error: "Wrong email or password" });
        }
      } else {
        res.json({ loginStatus: false, Error: "User not found" });
      }
    } catch (err) {
      console.error(err);
      res.json({ loginStatus: false, Error: "Query error" });
    }
  },

  register: async function (req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }
    try {
      const result = await userModel.createUser(username, password);
      res.status(201).send("User created successfully");
    } catch (err) {
      console.error("Error during registration:", err);
      res.status(500).send("Server error during registration");
    }
  },

  logout: function (req, res) {
    res.clearCookie("token", { httpOnly: true, secure: true, path: "/" });
    res.status(200).json({ status: "Success", message: "Logout successful" });
  },
};

export { authController };
