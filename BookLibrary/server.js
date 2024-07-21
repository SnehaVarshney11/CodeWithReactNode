import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Book from "./BookSchema.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get the directory name from the file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  console.log("Request received:", req.body);
  console.log("Uploaded file:", req.file);

  const { title, description } = req.body;
  const image = req.file?.path;

  if (!title || !description || !image) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newBook = new Book({
      title,
      image: `/uploads/${path.basename(image)}`,
      description,
    });
    await newBook.save();
    console.log("Book saved in DB", newBook);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error saving book:", error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/books", async (req, res) => {
  try {
    const getBook = await Book.find();
    res.status(200).json(getBook);
  } catch (error) {
    console.log("Error in getting book", error);
    res.status(500).json({ error: error.message });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
