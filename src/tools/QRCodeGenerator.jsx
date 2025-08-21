import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const QRCodeGenerator = () => {
    const [text, setText] = useState("");
    const qrRef = useRef(null);

    const handleDownload = () => {
        const canvas = qrRef.current.querySelector("canvas"); 
        const pngUrl = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `qrcode.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="app-root">
            <Header />
            <main className="container">
                <section className="card">
                    <h2 className="section-title">QR Code Generator</h2>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text or URL"
                        className="input"
                    />
                    {text && (
                        <div>
                            <div 
                                className="card preview-card" 
                                style={{ justifyContent: "center" }} 
                                ref={qrRef}
                            >
                                <QRCodeCanvas value={text} size={180} />
                            </div>
                            <div 
                                className="actions" 
                                style={{ display: "flex", justifyContent: "center", margin: "20px" }}
                            >
                                <button
                                    className="btn btn-ghost"
                                    onClick={handleDownload}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default QRCodeGenerator;
