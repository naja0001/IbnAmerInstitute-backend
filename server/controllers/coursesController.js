import Course from "../models/coursesModel.js";

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCourseById = (req, res) => {
  const { id } = req.params;

  Course.getById(id)
    .then((course) => {
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    })
    .catch((error) => {
      console.error("Error fetching course:", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
};

const createCourse = async (req, res) => {
  try {
    const { name, description, credits } = req.body;
    const newCourse = new Course({ name, description, credits });
    await newCourse.save();
    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCourseById = async (req, res) => {
  try {
    const { name, description, credits } = req.body;
    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, description, credits },
      { new: true }
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json({ message: "Course deleted successfully", course: deletedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourseById,
  deleteCourseById,
};
