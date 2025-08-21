import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Optional: for PDF export. Install with: npm i jspdf
let jsPDFLib = null;
(async () => {
  try {
    const mod = await import("jspdf");
    jsPDFLib = mod.jsPDF || mod.default || mod;
  } catch (_) {
    // jsPDF not available; PDF export will be disabled gracefully
  }
})();

export default function ImageTool() {
  // ===================== STATE =====================
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [maxSizeKB, setMaxSizeKB] = useState(100);
  const [compressedFile, setCompressedFile] = useState(null);
  const [actualDims, setActualDims] = useState(null);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileType, setFileType] = useState("jpeg"); // "jpeg" | "png" | "pdf"
  const [pdfText, setPdfText] = useState(false);

  const previewUrlRef = useRef(null);
  const downloadUrlRef = useRef(null);

  // ===================== HELPERS =====================
  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.decoding = "async";
      img.src = src;
    });

  const canvasToBlob = (canvas, type, quality) =>
    new Promise((resolve) => canvas.toBlob(resolve, type, quality));

  const drawToCanvas = (img, targetW, targetH, fit = "stretch") => {
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");

    if (fit === "stretch") {
      ctx.drawImage(img, 0, 0, targetW, targetH);
    } else {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const targetRatio = targetW / targetH;
      const imgRatio = iw / ih;

      if (fit === "contain") {
        let drawW, drawH;
        if (imgRatio > targetRatio) {
          drawW = targetW;
          drawH = Math.round(targetW / imgRatio);
        } else {
          drawH = targetH;
          drawW = Math.round(targetH * imgRatio);
        }
        const dx = Math.round((targetW - drawW) / 2);
        const dy = Math.round((targetH - drawH) / 2);
        ctx.clearRect(0, 0, targetW, targetH);
        ctx.drawImage(img, dx, dy, drawW, drawH);
      } else if (fit === "cover") {
        let srcW, srcH, sx, sy;
        if (imgRatio > targetRatio) {
          srcH = ih;
          srcW = Math.round(ih * targetRatio);
          sx = Math.round((iw - srcW) / 2);
          sy = 0;
        } else {
          srcW = iw;
          srcH = Math.round(iw / targetRatio);
          sx = 0;
          sy = Math.round((ih - srcH) / 2);
        }
        ctx.drawImage(img, sx, sy, srcW, srcH, 0, 0, targetW, targetH);
      }
    }

    return canvas;
  };

  const getDownloadFileName = (base, ext) => `${base}.${ext}`;

  // ===================== HANDLERS =====================
  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    setError("");
    setWarning("");
    if (!file) return;

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setImage(file);
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setPreview(url);

    setCompressedFile(null);
    setActualDims(null);
  };

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!preview) {
        setActualDims(null);
        return;
      }
      try {
        const img = await loadImage(preview);
        if (!cancelled) setActualDims({ w: img.naturalWidth, h: img.naturalHeight });
      } catch {
        if (!cancelled) setActualDims(null);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [preview]);

  const encodeJpegToTarget = async (canvas, targetBytes) => {
    let lo = 0.5,
      hi = 0.95,
      best = null;
    for (let i = 0; i < 8; i++) {
      const q = (lo + hi) / 2;
      const blob = await canvasToBlob(canvas, "image/jpeg", q);
      if (!blob) break;
      if (blob.size <= targetBytes) {
        best = blob;
        lo = q;
      } else hi = q;
    }
    if (!best) return await canvasToBlob(canvas, "image/jpeg", 0.5);
    return best;
  };

  const encodePng = async (canvas) => {
    const blob = await canvasToBlob(canvas, "image/png");
    return blob;
  };

  const encodePdf = async (canvas) => {
    if (!jsPDFLib) throw new Error("PDF library not available.");
    const pdf = new jsPDFLib({
      orientation: canvas.width >= canvas.height ? "l" : "p",
      unit: "pt",
      format: [canvas.width, canvas.height],
      compress: true,
    });
    const dataUrlJpeg = canvas.toDataURL("image/jpeg", 0.92);
    pdf.addImage(dataUrlJpeg, "JPEG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
    const blob = pdf.output("blob");
    return blob;
  };

  const handleCompress = async () => {
    if (!image) return;
    setIsProcessing(true);
    setError("");
    setWarning("");

    try {
      const srcUrl = URL.createObjectURL(image);
      const imgEl = await loadImage(srcUrl);
      URL.revokeObjectURL(srcUrl);

      const targetW = Math.max(1, Math.floor(width));
      const targetH = Math.max(1, Math.floor(height));
      const canvas = drawToCanvas(imgEl, targetW, targetH, "stretch");

      const targetBytes = Math.max(1, Math.floor(maxSizeKB * 1024));
      let outBlob = null,
        outName = "output",
        outMime = "application/octet-stream",
        outExt = "bin";

      if (fileType === "jpeg") {
        outBlob = await encodeJpegToTarget(canvas, targetBytes);
        outMime = "image/jpeg";
        outExt = "jpg";
        outName = "compressed_image";
        if (outBlob.size > targetBytes)
          setWarning("Target size could not be reached without quality loss.");
      } else if (fileType === "png") {
        outBlob = await encodePng(canvas);
        outMime = "image/png";
        outExt = "png";
        outName = "image";
        if (outBlob.size > targetBytes)
          setWarning("PNG is lossless; max size not guaranteed.");
      } else if (fileType === "pdf") {
        try {
          outBlob = await encodePdf(canvas);
          outMime = "application/pdf";
          outExt = "pdf";
          outName = "image";
        } catch {
          setWarning("PDF export not available. Exported PNG instead.");
          outBlob = await encodePng(canvas);
          outMime = "image/png";
          outExt = "png";
          outName = "image";
        }
      }

      if (!outBlob) throw new Error("Failed to create output.");
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      const outUrl = URL.createObjectURL(outBlob);
      previewUrlRef.current = outUrl;

      setCompressedFile(
        new File([outBlob], getDownloadFileName(outName, outExt), { type: outMime })
      );
      setPreview(outUrl);
      if (fileType === "pdf") setPdfText(true);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Compression failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedFile) return;

    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }

    const href = URL.createObjectURL(compressedFile);
    downloadUrlRef.current = href;

    const link = document.createElement("a");
    link.href = href;
    link.download = compressedFile.name || "output";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      if (downloadUrlRef.current) {
        URL.revokeObjectURL(downloadUrlRef.current);
        downloadUrlRef.current = null;
      }
    }, 0);
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      if (downloadUrlRef.current) URL.revokeObjectURL(downloadUrlRef.current);
    };
  }, []);

  const formattedSize = useMemo(() => {
    if (!compressedFile) return null;
    return (compressedFile.size / 1024).toFixed(2);
  }, [compressedFile]);

  // ===================== RENDER =====================
  return (
    <div className="app-root">
      <Header
        title="Image Resizer & Compressor"
        subtitle="Resize, compress, and export as JPEG/PNG/PDF—fast and private, all in your browser."
      />

      <main className="container">
        {/* ... paste your upload, controls, preview JSX here unchanged ... */}
        {/* This part can remain exactly as your existing App.js JSX */}
        <main className="container">
          <section className="card upload-card">
            <label className="file-input-label" htmlFor="file-input">
              <div className="file-drop">
                <div className="file-icon" aria-hidden>
                  🗂️
                </div>
                <div className="file-copy">
                  <strong>Select an image</strong> or drag & drop
                  <span className="file-hint">JPG, PNG supported</span>
                </div>
              </div>
            </label>
            <input
              id="file-input"
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleUpload}
            />
          </section>

          {image && (
            <>
              <section className="card controls-card">
                <h2 className="section-title">Settings</h2>
                <div className="grid grid-2 md:grid-3">
                  <label className="field">
                    <span className="field-label">Width (px)</span>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      value={width}
                      onChange={(e) => {
                        const val = e.target.value;
                        setWidth(val === "" ? "" : Math.max(1, Number(val)));
                      }}
                      inputMode="numeric"
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Height (px)</span>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      value={height}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHeight(val === "" ? "" : Math.max(1, Number(val)));
                      }}
                      inputMode="numeric"
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">Max Size (KB)</span>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      value={maxSizeKB}
                      onChange={(e) => {
                        const val = e.target.value;
                        setMaxSizeKB(val === "" ? "" : Math.max(1, Number(val)));
                      }}
                      inputMode="numeric"
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">File Type</span>
                    <select
                      className="select"
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                    >
                      <option value="jpeg">JPEG / JPG</option>
                      <option value="png">PNG</option>
                      <option value="pdf">PDF</option>
                    </select>
                  </label>
                </div>

                <div className="actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleCompress}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing…" : "Compress & Resize"}
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={handleDownload}
                    disabled={!compressedFile || isProcessing}
                  >
                    Download
                  </button>
                </div>

                {error && (
                  <div role="alert" className="alert alert-error">
                    {error}
                  </div>
                )}

                {warning && !error && (
                  <div role="status" className="alert alert-warn">
                    {warning}
                  </div>
                )}
              </section>

              <section className="card preview-card">
                <div className="preview-header">
                  <h2 className="section-title">Preview</h2>

                  {compressedFile && fileType !== "pdf" && actualDims && (
                    <div className="meta">
                      <span className="meta-chip">Size: {formattedSize} KB</span>
                      <span className="meta-dot" aria-hidden>
                        •
                      </span>
                      <span className="meta-chip">
                        Dimensions: {actualDims.w}×{actualDims.h}
                      </span>
                    </div>
                  )}

                  {compressedFile && fileType === "pdf" && (
                    <div className="meta">
                      <span className="meta-chip">Size: {formattedSize} KB</span>
                      <span className="meta-dot" aria-hidden>
                        •
                      </span>
                      <span className="meta-chip">
                        Page: {Math.max(1, Math.floor(width))}×
                        {Math.max(1, Math.floor(height))} pt
                      </span>
                    </div>
                  )}
                </div>

                <div className="preview-pane">
                  {preview ? (
                    fileType === "pdf" && pdfText ? (
                      <div className="pdf-note">
                        PDF generated. Use Download to save the file.
                      </div>
                    ) : (
                      <img src={preview} alt="Preview" className="preview-image" />
                    )
                  ) : (
                    <div className="preview-empty">No preview</div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>

      </main>

      <Footer />
    </div>
  );
}
