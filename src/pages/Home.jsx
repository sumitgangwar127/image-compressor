import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

// Popular tools array
const popularTools = [
  {
        id: 'Resize & Compress',
        title: 'Resize, Compress & Convert Images',
        description: 'Resize, compress, and change image format in one click.',
        route: '/tools/image-tool',
        emoji: '🖼️',
    },
    {
        id: 'qrcode',
        title: 'QR Code Generator',
        description: 'Generate QR codes from text or URLs.',
        route: '/tools/QRCodeGenerator',
        emoji: '🔳',
    },
    {
        id: 'colorpicker',
        title: 'Color Palette Picker',
        description: 'Pick and copy colors from a palette or wheel.',
        route: '/tools/ColorPalettePicker',
        emoji: '🎨',
    },
];

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="app-root">
      <Header />
      <main className="container">
        {/* Hero Section */}
        <section className="card">
          <h2 className="section-title">Welcome to My Utility Tools</h2>
          <p>
            A collection of fast, lightweight, and privacy-friendly tools to
            make your workflow easier. Resize, compress, and convert images – 
            with more utilities coming soon!
          </p>
          <div className="actions" style={{ marginTop: "12px" }}>
            <Link to="/tools" className="btn btn-primary">
              Explore Tools
            </Link>
          </div>
        </section>

        {/* Featured Tools Grid */}
        <section className="card">
          <h3 className="section-title">Popular Tools</h3>
          <div className="tools-grid">
            {popularTools.map((tool) => (
              <button key={tool.id} onClick={() => navigate(tool.route)} className="tool-card">
                <div className="tool-icon">{tool.emoji}</div>
                <div className="tool-content">
                  <h4 className="tool-title">{tool.title}</h4>
                  <p className="tool-desc">{tool.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="card">
          <h3 className="section-title">Why Use These Tools?</h3>
          <ul>
            <li>⚡ Fast & lightweight – runs directly in your browser</li>
            <li>🔒 Privacy-focused – no uploads, everything stays local</li>
            <li>🎨 Clean UI – distraction-free and simple to use</li>
            <li>📱 Works on all devices – desktop, tablet, and mobile</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
