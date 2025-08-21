import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const [theme, setTheme] = useState("dark");

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="app-header">
      <div className="container header-flex">
        <h1 className="app-title">My Utility Tools</h1>
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/tools">Tools</Link> |{" "}
          <Link to="/about">About</Link> |{" "}
          <Link to="/contact">Contact</Link>
        </nav>
        {/* <button onClick={toggleTheme} className="btn btn-plain theme-toggle">
          {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
        </button> */}
      </div>
    </header>
  );
}
