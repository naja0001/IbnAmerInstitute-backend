import dbConfig from "../../db-connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Auth = {
  // Method to find a user by username
  findByUsername: (username, callback) => {
    const queryString = "SELECT * FROM users WHERE username = ?";
    dbConfig.query(queryString, [username], (error, results) => {
      if (error) {
        console.error(error);
        return callback(error, null);
      }
      if (results.length === 0) {
        return callback({ message: "User not found" }, null);
      }
      return callback(null, results[0]);
    });
  },

  // Method to authenticate user login
  authenticate: async (username, password, callback) => {
    try {
      const user = await Auth.findByUsername(username);
      if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
        return callback({ message: "Invalid credentials" }, null);
      }
      return callback(null, user);
    } catch (error) {
      console.error(error);
      return callback({ message: "Internal Server Error" }, null);
    }
  },

  // Method to generate JWT token
  generateToken: (userId, username) => {
    return jwt.sign({ userId, username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  },

  // Method to register a new user
  registerUser: async (username, password, callback) => {
    try {
      const existingUser = await Auth.findByUsername(username);
      if (existingUser) {
        return callback({ message: "User already exists" }, null);
      }

      const passwordHash = bcrypt.hashSync(password, 10);
      const queryString =
        "INSERT INTO users (username, passwordHash) VALUES (?, ?)";
      dbConfig.query(
        queryString,
        [username, passwordHash],
        (error, results) => {
          if (error) {
            console.error(error);
            return callback({ message: "Internal Server Error" }, null);
          }
          return callback(null, { message: "User created successfully" });
        }
      );
    } catch (error) {
      console.error(error);
      return callback({ message: "Internal Server Error" }, null);
    }
  },

  // Method to revoke user tokens or perform other session-related tasks
  logout: async (userId, callback) => {
    // Implement logout logic here, such as deleting user sessions from a sessions table in the database
    // For example:
    dbConfig.query(
      "DELETE FROM sessions WHERE userId = ?",
      userId,
      (error, results) => {
        if (error) {
          console.error(error);
          return callback({ message: "Internal Server Error" }, null);
        }
        return callback(null, { message: "Logout successful" });
      }
    );

    // For JWT-based authentication, you typically don't need to do anything on the server-side
    // Instead, the client should discard the JWT token or remove it from local storage
    // You can send a response indicating successful logout if needed
    // return callback(null, { message: "Logout successful" });
  },
};

export default Auth;
