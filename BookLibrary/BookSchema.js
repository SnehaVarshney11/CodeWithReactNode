import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Book = mongoose.model("Book", BookSchema);
export default Book;
