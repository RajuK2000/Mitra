import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Chatbox from "./components/chatbox";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Login } from "./pages/LoginPage/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Register from "./pages/Register/Register";

const titles = [
  "Apple",
  "Banana",
  "Orange",
  "Mango",
  "Grapes",
  "Pineapple",
];
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("Choose job role");

  const dropdownRef = useRef(null);

  const filteredOptions = titles.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = value => {
    setSelected(value);
    setIsOpen(false);
    setSearch("");
  };


  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
       <Route path="/register" element={<Register/>}/>
       <Route path="/chats" element={<ProtectedRoute><Chatbox /></ProtectedRoute>} />
      </Routes>
      {/* <h1>hhjbjbhjbj</h1> */}
     {/* <Chatbox /> */}

 {/* <div className="search-field">
        
        <select
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="search-input"
        >
          <option value=""></option>
          {titles.map((job, i) => (
            <option key={i} value={job}>
              {job}
            </option>
          ))}
        </select>
      </div> */}
      </BrowserRouter>
    </>
  );
}

export default App;
