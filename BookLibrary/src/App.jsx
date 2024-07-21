import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Books from "./Components/Books";
import Home from "./Components/Home";
import NavBar from "./Components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <div className="mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
        </Routes>
      </div>
    </>
  );
}

const Root = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default Root;
