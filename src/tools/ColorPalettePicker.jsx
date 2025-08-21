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
                        <SketchPicker
                            className="card preview-card"
                            color={currentColor}
                            onChangeComplete={(color) => setCurrentColor(color.hex)}
                        />

                        <div className="actions">
                            <button className="btn btn-ghost" onClick={addColor}>
                                Add to Palette
                            </button>
                        </div>

                        <div className="palette">
                            {colors.map((c, i) => (
                                <div
                                    key={i}
                                    className="color-item"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBottom: "10px",
                                        padding: "8px 12px",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        background: "#fafafa",
                                    }}
                                >
                                    {/* Left side: Color Preview + Text */}
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <div
                                            className="color-box"
                                            style={{
                                                backgroundColor: c,
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "6px",
                                                marginRight: "12px",
                                                border: "1px solid #ccc",
                                            }}
                                        ></div>

                                        <span
                                            style={{
                                                fontFamily: "monospace",
                                                fontSize: "14px",
                                                color: "#333",
                                            }}
                                        >
                                            {c}
                                        </span>
                                    </div>

                                    {/* Right side: Copy Button */}
                                    <button
                                        onClick={() => handleCopy(c)}
                                        style={{
                                            border: "none",
                                            padding: "6px 12px",
                                            fontSize: "13px",
                                            marginLeft: "6px",
                                            borderRadius: "6px",
                                            background: copied === c ? "#4caf50" : "#eee",
                                            color: copied === c ? "#fff" : "#333",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
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
