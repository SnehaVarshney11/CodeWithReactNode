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

app.use(cors()); //protect with cross origin -> cors error
app.use(bodyParser.json()); //parse the body of incoming req and ensure data availabilty in req.body -> { "name": "Sneha", "role": "Engineer" }
app.use(bodyParser.urlencoded({ extended: true })); //parse URL encoded from data -> name=Sneha&role=Engineer

const __filename = fileURLToPath(import.meta.url); // Convert the URL of the current module to a file path
const __dirname = path.dirname(__filename); // Get the directory name of the current module

// Define uploads directories
const imageUploadPath = path.join(__dirname, "uploads/images");
const pdfUploadPath = path.join(__dirname, "uploads/pdfs");

fs.mkdirSync(imageUploadPath, { recursive: true });
fs.mkdirSync(pdfUploadPath, { recursive: true });

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from the "uploads" directory

const storage = multer.diskStorage({
  // multer.diskStorage() -> configures how files should be stored on disk. It takes an object with two properties: destination and filename
  destination: (req, file, cb) => {
    //cb is callback function to specify destination folder
    if (file.mimetype === "application/pdf") {
      //MIME type is a way to identify the type of file being uploaded.
      //If the file is a PDF, call the callback function cb with null as the first argument (indicating no error) and pdfUploadPath as the second argument (the path where PDF files should be stored)
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

//POST API for uploading pdf, images, title, description
app.post(
  "/books",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("Request received:", req.body);
    console.log("Uploaded files:", req.files);

    const { title, description } = req.body; // Extract title, description from req body
    const image = req.files.image[0].path; // Extract image from path, when using Multer with upload.fields(), the uploaded files are provided as arrays
    const pdf = req.files.pdf[0].path; // Extract pdf from path, when using Multer with upload.fields(), the uploaded files are provided as arrays

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

// GET API -> for display the books
app.get("/books", async (req, res) => {
  try {
    const getBook = await Book.find();
    res.status(200).json(getBook);
  } catch (error) {
    console.log("Error in getting book", error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE API -> delete book by ID
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

// Download PDF by ID
app.get("/books/download/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log("Download request pdf ID: ", bookId);

    if (!bookId) {
      return res.status(400).json({ error: "ID is required" });
    }

    //Find book to get filepath
    const book = await Book.findById(bookId);

    if (!book || !book.pdf) {
      return res.status(404).json({ error: "File not found" });
    }

    //File Path
    const filePath = path.join(
      __dirname,
      "uploads/pdfs",
      path.basename(book.pdf)
    );
    console.log("File Path:", filePath);

    res.download(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ error: "Error sending file" });
      } else {
        console.log("PDF Downloaded");
      }
    });
  } catch (error) {
    console.error("Error downloading book:", error);
    res.status(500).json({ error: error.message });
  }
});

//Search Book by title
app.get("/books/search", async (req, res) => {
  try {
    // Why req.query -> When a client sends a GET request with query parameters, the URL might look like this: /books/search?title=JavaScript
    const { title } = req.query; //Extract title query from the URL
    if (!title) {
      return res
        .status(400)
        .json({ error: "Title query parameter is required" });
    }

    // Use a case-insensitive search
    const books = await Book.find({
      title: { $regex: new RegExp(title, "i") },
    });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error searching books:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
