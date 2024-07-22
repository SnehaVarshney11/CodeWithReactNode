import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fs from "fs";
import { unlink } from "fs/promises";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Book from "./BookSchema.js";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directories exist
const imageUploadPath = path.join(__dirname, "uploads/images");
const pdfUploadPath = path.join(__dirname, "uploads/pdfs");

fs.mkdirSync(imageUploadPath, { recursive: true });
fs.mkdirSync(pdfUploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, pdfUploadPath);
    } else {
      cb(null, imageUploadPath);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

mongoose
  .connect("mongodb://localhost:27017/BookLibrary", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post(
  "/books",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("Request received:", req.body);
    console.log("Uploaded files:", req.files);

    const { title, description } = req.body;
    const image = req.files.image?.[0].path;
    const pdf = req.files.pdf?.[0].path;

    if (!title || !description || !image || !pdf) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const newBook = new Book({
        title,
        image: `/uploads/images/${path.basename(image)}`,
        pdf: `/uploads/pdfs/${path.basename(pdf)}`,
        description,
      });
      await newBook.save();
      console.log("Book saved in DB", newBook);
      res.status(201).json(newBook);
    } catch (error) {
      console.error("Error saving book:", error);
      res.status(400).json({ error: error.message });
    }
  }
);

app.get("/books", async (req, res) => {
  try {
    const getBook = await Book.find();
    res.status(200).json(getBook);
  } catch (error) {
    console.log("Error in getting book", error);
    res.status(500).json({ error: error.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log("Id: ", bookId);

    if (!bookId) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Find the book to get the file paths
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(400).json({ error: "Data Not Found" });
    }

    // Delete the book
    await Book.findByIdAndDelete(bookId);

    // Remove the files from the filesystem
    const imagePath = path.join(__dirname, book.image);
    const pdfPath = path.join(__dirname, book.pdf);

    await Promise.all([
      book.image ? unlink(imagePath) : Promise.resolve(),
      book.pdf ? unlink(pdfPath) : Promise.resolve(),
    ]);

    console.log("Data Deleted");
    res.status(200).json({ message: "Book deleted" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
