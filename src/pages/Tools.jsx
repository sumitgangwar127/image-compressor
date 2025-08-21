import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Define your tools in one place to keep JSX clean
const TOOL_ITEMS = [
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

    // {
    //     id: 'image-compressor',
    //     title: 'Image Compressor',
    //     description: 'Compress images to reduce file size.',
    //     route: '/tools/image-compressor',
    //     emoji: '🗜️',
    // },
    // {
    //     id: 'image-converter',
    //     title: 'Image Converter',
    //     description: 'Convert between JPG, PNG, WebP, and more.',
    //     route: '/tools/image-converter',
    //     emoji: '🔄',
    // },
    // {
    //     id: 'cropper',
    //     title: 'Image Cropper',
    //     description: 'Crop images to common aspect ratios.',
    //     route: '/tools/cropper',
    //     emoji: '✂️',
    // },
    // {
    //     id: 'metadata-viewer',
    //     title: 'Metadata Viewer',
    //     description: 'View and remove EXIF metadata.',
    //     route: '/tools/metadata',
    //     emoji: 'ℹ️',
    // },
    // Add more tools here…
]

function Tools() {
    const navigate = useNavigate()

    return (
        <div className="app-root">
            <Header />
            <main className="container">
                <h2>My Tools</h2>
                <p>Resize, compress, and convert your images online. More tools coming soon!</p>

                <div className="tools-grid">
                    {TOOL_ITEMS.map(tool => (
                        <button
                            key={tool.id}
                            className="tool-card"
                            onClick={() => navigate(tool.route)}
                            aria-label={tool.title}
                        >
                            <div className="tool-icon">{tool.emoji}</div>
                            <div className="tool-content">
                                <h3 className="tool-title">{tool.title}</h3>
                                <p className="tool-desc">{tool.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Tools
