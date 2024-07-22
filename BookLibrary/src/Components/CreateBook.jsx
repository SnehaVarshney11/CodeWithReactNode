import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import "../index.css";

Modal.setAppElement("#root");

function CreateBook({ isOpen, onClose, onBookAdded }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", image);
    formData.append("pdf", pdf);
    formData.append("description", description);

    try {
      const res = await axios.post("http://localhost:5000/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onBookAdded(res.data);
      console.log("Book is Created", res.data);
      setTitle("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Add Book">
      <h2>Add Book</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-black p-4"
      >
        <div className="space-x-2">
          <label>Title:</label>
          <input
            type="text"
            className="border border-black outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-x-2">
          <label>Cover Photo:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <div className="space-x-2">
          <label>PDF File:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdf(e.target.files[0])}
            required
          />
        </div>

        <div className="space-x-2">
          <label>Description:</label>
          <textarea
            value={description}
            className="border border-black outline-none"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="space-x-5">
          <button type="submit" className="bg-blue-400">
            Ok
          </button>
          <button type="button" onClick={onClose} className="bg-red-400">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateBook;
