const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static(__dirname));

// Simple file-based storage for local development
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
        portfolio: [
            { id: 1, title: 'Brand Identity Project', description: 'Complete brand identity for a tech startup', category: 'branding', image: 'fas fa-image' },
            { id: 2, title: 'Logo Design Collection', description: 'Modern logo designs for various industries', category: 'logo', image: 'fas fa-cube' },
            { id: 3, title: 'Print Design Campaign', description: 'Marketing materials and print advertisements', category: 'print', image: 'fas fa-print' },
            { id: 4, title: 'Digital Design Portfolio', description: 'Web and mobile app design projects', category: 'digital', image: 'fas fa-laptop' },
            { id: 5, title: 'Corporate Branding', description: 'Brand identity for corporate clients', category: 'branding', image: 'fas fa-briefcase' },
            { id: 6, title: 'Creative Logo Series', description: 'Innovative logo designs and concepts', category: 'logo', image: 'fas fa-star' }
        ],
        services: [
            { id: 1, title: 'Brand Identity', description: 'Complete brand identity design including logo, color palette, typography, and brand guidelines.', icon: 'fas fa-palette' },
            { id: 2, title: 'Logo Design', description: 'Custom logo design that captures your brand\'s essence and stands out in the market.', icon: 'fas fa-vector-square' },
            { id: 3, title: 'Print Design', description: 'Professional print materials including brochures, business cards, posters, and marketing collateral.', icon: 'fas fa-print' },
            { id: 4, title: 'Digital Design', description: 'Modern web and mobile app design with focus on user experience and visual appeal.', icon: 'fas fa-mobile-alt' }
        ],
        about: {
            name: 'John Kurt Facturan',
            profession: 'Creative Graphic Designer',
            bio: 'Hello! I am John Kurt Facturan, a passionate graphic designer with over 5 years of experience creating compelling visual identities, branding solutions, and digital experiences. I believe in the power of design to communicate, inspire, and transform.',
            projects: '50',
            clients: '0',
            experience: '1',
            skills: ['Brand Identity', 'Logo Design', 'Print Design', 'Digital Design', 'Adobe Creative Suite', 'Figma', 'Typography', 'Mockups']
        },
        contact: {
            email: 'jkurtzhie12@gmail.com',
            phone: '09944594696',
            location: 'Poblacion Mabinay Negros Oriental',
            behance: '',
            dribbble: '',
            linkedin: '',
            instagram: ''
        },
        settings: {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            portfolioTitle: 'John Kurt Facturan - Graphic Designer Portfolio',
            portfolioDescription: 'A modern, responsive portfolio showcasing creative graphic design work and branding solutions.'
        },
        images: {
            heroImage: null,
            homeBackgroundImage: null,
            backgroundOpacity: '50'
        }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
}

// Helper functions for data management
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data:', error);
        return {};
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing data:', error);
        return false;
    }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: 'local'
    });
});

// Get all data
app.get('/api/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// Portfolio
app.get('/api/portfolio', (req, res) => {
    const data = readData();
    res.json(data.portfolio || []);
});

app.post('/api/portfolio', (req, res) => {
    const data = readData();
    data.portfolio = req.body;
    if (writeData(data)) {
        res.json({ success: true, message: 'Portfolio updated successfully', environment: 'local' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Services
app.get('/api/services', (req, res) => {
    const data = readData();
    res.json(data.services || []);
});

app.post('/api/services', (req, res) => {
    const data = readData();
    data.services = req.body;
    if (writeData(data)) {
        res.json({ success: true, message: 'Services updated successfully', environment: 'local' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// About
app.get('/api/about', (req, res) => {
    const data = readData();
    res.json(data.about || {});
});

app.post('/api/about', (req, res) => {
    const data = readData();
    data.about = req.body;
    if (writeData(data)) {
        res.json({ success: true, message: 'About section updated successfully', environment: 'local' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Contact
app.get('/api/contact', (req, res) => {
    const data = readData();
    res.json(data.contact || {});
});

app.post('/api/contact', (req, res) => {
    const data = readData();
    data.contact = req.body;
    if (writeData(data)) {
        res.json({ success: true, message: 'Contact information updated successfully', environment: 'local' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Settings
app.get('/api/settings', (req, res) => {
    const data = readData();
    res.json(data.settings || {});
});

app.post('/api/settings', (req, res) => {
    const data = readData();
    data.settings = req.body;
    if (writeData(data)) {
        res.json({ success: true, message: 'Settings updated successfully', environment: 'local' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Images
app.get('/api/images', (req, res) => {
    const data = readData();
    res.json(data.images || {});
});

app.post('/api/images', (req, res) => {
    const data = readData();
    data.images = req.body;
    if (writeData(data)) {
        res.json({ success: true, message: 'Images updated successfully', environment: 'local' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Upload hero image
app.post('/api/upload/hero', (req, res) => {
    console.log('Upload hero request body:', JSON.stringify(req.body, null, 2));
    const { imageData } = req.body;
    if (!imageData) {
        return res.status(400).json({ error: 'No image data provided' });
    }

    const data = readData();
    if (!data.images) data.images = {};
    data.images.heroImage = imageData;

    if (writeData(data)) {
        res.json({ 
            success: true, 
            message: 'Hero image uploaded successfully',
            imageData: imageData,
            environment: 'local'
        });
    } else {
        res.status(500).json({ error: 'Failed to save image data' });
    }
});

app.delete('/api/upload/hero', (req, res) => {
    const data = readData();
    if (!data.images) data.images = {};
    data.images.heroImage = null;

    if (writeData(data)) {
        res.json({ success: true, message: 'Hero image deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to delete image data' });
    }
});

// Upload background image
app.post('/api/upload/background', (req, res) => {
    const { imageData } = req.body;
    if (!imageData) {
        return res.status(400).json({ error: 'No image data provided' });
    }

    const data = readData();
    if (!data.images) data.images = {};
    data.images.homeBackgroundImage = imageData;

    if (writeData(data)) {
        res.json({ 
            success: true, 
            message: 'Background image uploaded successfully',
            imageData: imageData,
            environment: 'local'
        });
    } else {
        res.status(500).json({ error: 'Failed to save image data' });
    }
});

app.delete('/api/upload/background', (req, res) => {
    const data = readData();
    if (!data.images) data.images = {};
    data.images.homeBackgroundImage = null;

    if (writeData(data)) {
        res.json({ success: true, message: 'Background image deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to delete image data' });
    }
});

// Login (simple demo)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.json({ 
            success: true, 
            token: 'demo-token',
            user: 'admin',
            environment: 'local'
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Fallback route for SPA
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Portfolio server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin.html`);
    console.log(`API health: http://localhost:${PORT}/api/health`);
});