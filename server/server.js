const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

require("dotenv").config();

const app = express();
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

if (!mongoUri) {
  throw new Error("MONGODB_URI is not configured");
}

mongoose
.connect(mongoUri)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("MongoDB connection error", err);
});

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.post(["/students", "/api/students"], async (req, res) => {
  try {
    const { name, course, age } = req.body;
    const newStudent = new Student({ name, course, age });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get(["/students", "/api/students"], async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete(["/students/:id", "/api/students/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put(["/students/:id", "/api/students/:id"], async (req, res) => {
  try {
    const { id } = req.params;
    const { name, course, age } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, course, age },
      { new: true }
    );
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 5000;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
