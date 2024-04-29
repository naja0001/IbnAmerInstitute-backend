import QuranProgress from "../models/quranProgress.js";

const getAllQuranProgress = async (req, res) => {
  try {
    const quranProgress = await QuranProgress.find();
    res.json(quranProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getQuranProgressById = async (req, res) => {
  try {
    const { id } = req.params;
    const quranProgress = await QuranProgress.findById(id);
    if (!quranProgress) {
      return res.status(404).json({ message: "Quran progress not found" });
    }
    res.json(quranProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createQuranProgress = async (req, res) => {
  try {
    // Extract data from request body
    const {
      students_id,
      chapter_number,
      is_completed,
      completion_date,
      grade,
    } = req.body;
    // Create a new QuranProgress instance
    const newQuranProgress = new QuranProgress({
      students_id,
      chapter_number,
      is_completed,
      completion_date,
      grade,
    });
    // Save the new QuranProgress instance to the database
    await newQuranProgress.save();
    res.status(201).json({
      message: "Quran progress created successfully",
      quranProgress: newQuranProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateQuranProgressById = async (req, res) => {
  try {
    // Extract data from request body
    const {
      students_id,
      chapter_number,
      is_completed,
      completion_date,
      grade,
    } = req.body;
    const { id } = req.params;
    // Find the QuranProgress by ID and update its fields
    const updatedQuranProgress = await QuranProgress.findByIdAndUpdate(
      id,
      { students_id, chapter_number, is_completed, completion_date, grade },
      { new: true }
    );
    if (!updatedQuranProgress) {
      return res.status(404).json({ message: "Quran progress not found" });
    }
    res.json({
      message: "Quran progress updated successfully",
      quranProgress: updatedQuranProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteQuranProgressById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the QuranProgress by ID and delete it
    const deletedQuranProgress = await QuranProgress.findByIdAndDelete(id);
    if (!deletedQuranProgress) {
      return res.status(404).json({ message: "Quran progress not found" });
    }
    res.json({
      message: "Quran progress deleted successfully",
      quranProgress: deletedQuranProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getAllQuranProgress,
  getQuranProgressById,
  createQuranProgress,
  updateQuranProgressById,
  deleteQuranProgressById,
};
