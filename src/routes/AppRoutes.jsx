import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Tools from "../pages/Tools";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Terms from "../pages/Terms";
import ImageTool from "../tools/ImageTool";
import QRCodeGenerator from "../tools/QRCodeGenerator";
import ColorPalettePicker from "../tools/ColorPalettePicker";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        {/* Tools Route */}
        <Route path="/tools/image-tool" element={<ImageTool />} />
        <Route path="/tools/QRCodeGenerator" element={<QRCodeGenerator />} />
        <Route path="/tools/ColorPalettePicker" element={<ColorPalettePicker />} />
      </Routes>
    </BrowserRouter>
  );
}
