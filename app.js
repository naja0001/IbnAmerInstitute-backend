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

const app = express();
const port = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: "https://thankful-dune-048548c03.5.azurestaticapps.net", // Ensure this exactly matches the client's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Adjust according to your needs
    credentials: true, // if you are using cookies or authentication
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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.get("/", (req, res) => {
  res.send("Hello, this is the backend.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
