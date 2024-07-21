import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import Book from "./BookSchema";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({
  dest: path.join(__dirname, "uploads"),
});

mongoose
  .connect("mongodb://localhost:27017/BookLibrary", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/books", upload.single("image"), async (req, res) => {
  const { title, description } = req.body;
  const image = req.file?.path;

  if (!title || !description || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    //const newBook = new Book({ title, image, description });
    const newBook = new Book({ title, image, description });
    await newBook.save();
    console.log("Book saved in DB", newBook);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error saving book:", error);
    res.status(400).json({ error: error.message });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
