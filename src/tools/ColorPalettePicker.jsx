import React, { useState } from "react";
import { SketchPicker } from "react-color";
import Footer from "../components/Footer";
import Header from "../components/Header";

const ColorPalettePicker = () => {
  const [colors, setColors] = useState(["#3498db", "#e74c3c", "#2ecc71"]);
  const [currentColor, setCurrentColor] = useState("#3498db");
  const [copied, setCopied] = useState(null);

  const addColor = () => {
    if (!colors.includes(currentColor)) {
      setColors([...colors, currentColor]);
    }
  };

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="app-root">
      <Header />
      <div className="container">
        <section className="card">
          <h2 className="section-title">Color Palette Picker</h2>

          <div className="palette-container">
            {/* Left side - Color Picker */}
            <div className="picker-wrapper">
              <SketchPicker
                className="color-picker"
                color={currentColor}
                onChangeComplete={(color) => setCurrentColor(color.hex)}
              />

              <div className="actions">
                <button className="btn btn-ghost" onClick={addColor}>
                  Add to Palette
                </button>
              </div>
            </div>

            {/* Right side - Palette */}
            <div className="palette">
              {colors.map((c, i) => (
                <div key={i} className="color-item">
                  <div className="color-info">
                    <div
                      className="color-box"
                      style={{ backgroundColor: c }}
                    ></div>
                    <span>{c}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(c)}
                    className={`copy-btn ${copied === c ? "copied" : ""}`}
                  >
                    {copied === c ? "Copied!" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ColorPalettePicker;
