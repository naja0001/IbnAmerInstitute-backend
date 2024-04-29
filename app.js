import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import authRouter from "./server/routes/auth/index.js";
import studentsRouter from "./server/routes/students.js";
import teachersRouter from "./server/Routes/teachers.js";
import attendanceRouter from "./server/routes/attendance.js";

import homeworkRouter from "./server/Routes/homework.js";
import coursesRouter from "./server/Routes/courses.js";
import classesRouter from "./server/Routes/classes.js";
import studentClassesRouter from "./server/Routes/studentClasses.js";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "./server/controllers/authController.js";

import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudentById,
  deleteStudentById,
} from "./server/controllers/studentsController.js";

import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacherById,
  deleteTeacherById,
} from "./server/controllers/teachersController.js";

import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourseById,
  deleteCourseById,
} from "./server/controllers/coursesController.js";

import {
  getAllAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendanceById,
  deleteAttendanceById,
} from "./server/controllers/attendanceController.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/students", studentsRouter);
app.use("/teachers", teachersRouter);
app.use("/attendance", attendanceRouter);

app.use("/homework", homeworkRouter);
app.use("/courses", coursesRouter);
app.use("/classes", classesRouter);
app.use("/studentClasses", studentClassesRouter);

// Route for user logout
authRouter.post("/logout", logoutUser);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

// Define student routes
studentsRouter.get("/", getAllStudents);
studentsRouter.get("/:id", getStudentById);
studentsRouter.post("/", createStudent);
studentsRouter.put("/:id", updateStudentById);
studentsRouter.delete("/:id", deleteStudentById);

// Define teacher routes
teachersRouter.get("/", getAllTeachers);
teachersRouter.get("/:id", getTeacherById);
teachersRouter.post("/", createTeacher);
teachersRouter.put("/:id", updateTeacherById);
teachersRouter.delete("/:id", deleteTeacherById);

// Define Quran progress routes

// Define course routes
coursesRouter.get("/", getAllCourses);
coursesRouter.get("/:id", getCourseById);
coursesRouter.post("/", createCourse);
coursesRouter.put("/:id", updateCourseById);
coursesRouter.delete("/:id", deleteCourseById);

// Define attendance routes
attendanceRouter.get("/", getAllAttendances);
attendanceRouter.get("/:id", getAttendanceById);
attendanceRouter.post("/", createAttendance);
attendanceRouter.put("/:id", updateAttendanceById);
attendanceRouter.delete("/:id", deleteAttendanceById);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Route for root endpoint
app.get("/", (req, res) => {
  res.send("Hello, this is the backend.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
