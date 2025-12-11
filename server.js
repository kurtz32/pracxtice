const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('.'));

// File upload configuration
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Data file path
const dataFile = path.join(__dirname, 'portfolio-data.json');

// Initialize default data
const defaultData = {
    portfolio: [
        {
            id: 1,
            title: 'Brand Identity Project',
            description: 'Complete brand identity for a tech startup',
            category: 'branding',
            image: 'fas fa-image'
        },
        {
            id: 2,
            title: 'Logo Design Collection',
            description: 'Modern logo designs for various industries',
            category: 'logo',
            image: 'fas fa-cube'
        },
        {
            id: 3,
            title: 'Print Design Campaign',
            description: 'Marketing materials and print advertisements',
            category: 'print',
            image: 'fas fa-print'
        },
        {
            id: 4,
            title: 'Digital Design Portfolio',
            description: 'Web and mobile app design projects',
            category: 'digital',
            image: 'fas fa-laptop'
        },
        {
            id: 5,
            title: 'Corporate Branding',
            description: 'Brand identity for corporate clients',
            category: 'branding',
            image: 'fas fa-briefcase'
        },
        {
            id: 6,
            title: 'Creative Logo Series',
            description: 'Innovative logo designs and concepts',
            category: 'logo',
            image: 'fas fa-star'
        }
    ],
    services: [
        {
            id: 1,
            title: 'Brand Identity',
            description: 'Complete brand identity design including logo, color palette, typography, and brand guidelines.',
            icon: 'fas fa-palette'
        },
        {
            id: 2,
            title: 'Logo Design',
            description: 'Custom logo design that captures your brand\'s essence and stands out in the market.',
            icon: 'fas fa-vector-square'
        },
        {
            id: 3,
            title: 'Print Design',
            description: 'Professional print materials including brochures, business cards, posters, and marketing collateral.',
            icon: 'fas fa-print'
        },
        {
            id: 4,
            title: 'Digital Design',
            description: 'Modern web and mobile app design with focus on user experience and visual appeal.',
            icon: 'fas fa-mobile-alt'
        }
    ],
    about: {
        name: 'Alex Chen',
        profession: 'Creative Graphic Designer',
        bio: 'Hello! I\'m Alex Chen, a passionate graphic designer with over 5 years of experience creating compelling visual identities, branding solutions, and digital experiences. I believe in the power of design to communicate, inspire, and transform.',
        projects: '150',
        clients: '50',
        experience: '5',
        skills: ['Brand Identity', 'Logo Design', 'Print Design', 'Digital Design', 'Adobe Creative Suite', 'Figma', 'UI/UX Design', 'Typography']
    },
    contact: {
        email: 'alex.chen@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        behance: '',
        dribbble: '',
        instagram: '',
        linkedin: ''
    },
    settings: {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        portfolioTitle: 'Alex Chen - Graphic Designer Portfolio',
        portfolioDescription: 'A modern, responsive portfolio showcasing creative graphic design work and branding solutions.'
    },
    images: {
        heroImage: null,
        homeBackgroundImage: null,
        backgroundOpacity: '50'
    }
};

// Helper functions
async function readData() {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File doesn't exist, create with default data
            await writeData(defaultData);
            return defaultData;
        }
        throw error;
    }
}

async function writeData(data) {
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

// API Routes

// Get all data
app.get('/api/data', async (req, res) => {
    try {
        const data = await readData();
        res.json(data);
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).json({ error: 'Failed to read data' });
    }
});

// Get specific data sections
app.get('/api/portfolio', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.portfolio || []);
    } catch (error) {
        console.error('Error reading portfolio:', error);
        res.status(500).json({ error: 'Failed to read portfolio' });
    }
});

app.get('/api/services', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.services || []);
    } catch (error) {
        console.error('Error reading services:', error);
        res.status(500).json({ error: 'Failed to read services' });
    }
});

app.get('/api/about', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.about || {});
    } catch (error) {
        console.error('Error reading about:', error);
        res.status(500).json({ error: 'Failed to read about' });
    }
});

app.get('/api/contact', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.contact || {});
    } catch (error) {
        console.error('Error reading contact:', error);
        res.status(500).json({ error: 'Failed to read contact' });
    }
});

app.get('/api/settings', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.settings || {});
    } catch (error) {
        console.error('Error reading settings:', error);
        res.status(500).json({ error: 'Failed to read settings' });
    }
});

app.get('/api/images', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.images || {});
    } catch (error) {
        console.error('Error reading images:', error);
        res.status(500).json({ error: 'Failed to read images' });
    }
});

// Update data sections
app.post('/api/portfolio', async (req, res) => {
    try {
        const data = await readData();
        data.portfolio = req.body;
        await writeData(data);
        res.json({ success: true, message: 'Portfolio updated successfully' });
    } catch (error) {
        console.error('Error updating portfolio:', error);
        res.status(500).json({ error: 'Failed to update portfolio' });
    }
});

app.post('/api/services', async (req, res) => {
    try {
        const data = await readData();
        data.services = req.body;
        await writeData(data);
        res.json({ success: true, message: 'Services updated successfully' });
    } catch (error) {
        console.error('Error updating services:', error);
        res.status(500).json({ error: 'Failed to update services' });
    }
});

app.post('/api/about', async (req, res) => {
    try {
        const data = await readData();
        data.about = req.body;
        await writeData(data);
        res.json({ success: true, message: 'About section updated successfully' });
    } catch (error) {
        console.error('Error updating about:', error);
        res.status(500).json({ error: 'Failed to update about' });
    }
});

app.post('/api/contact', async (req, res) => {
    try {
        const data = await readData();
        data.contact = req.body;
        await writeData(data);
        res.json({ success: true, message: 'Contact information updated successfully' });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
});

app.post('/api/settings', async (req, res) => {
    try {
        const data = await readData();
        data.settings = req.body;
        await writeData(data);
        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

app.post('/api/images', async (req, res) => {
    try {
        const data = await readData();
        data.images = { ...data.images, ...req.body };
        await writeData(data);
        res.json({ success: true, message: 'Images updated successfully' });
    } catch (error) {
        console.error('Error updating images:', error);
        res.status(500).json({ error: 'Failed to update images' });
    }
});

// Image upload endpoints
app.post('/api/upload/hero', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const imageData = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${imageData}`;
        
        const data = await readData();
        data.images.heroImage = dataUrl;
        await writeData(data);
        
        res.json({ success: true, imageData: dataUrl });
    } catch (error) {
        console.error('Error uploading hero image:', error);
        res.status(500).json({ error: 'Failed to upload hero image' });
    }
});

app.post('/api/upload/background', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const imageData = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimetype};base64,${imageData}`;
        
        const data = await readData();
        data.images.homeBackgroundImage = dataUrl;
        await writeData(data);
        
        res.json({ success: true, imageData: dataUrl });
    } catch (error) {
        console.error('Error uploading background image:', error);
        res.status(500).json({ error: 'Failed to upload background image' });
    }
});

// Delete image endpoints
app.delete('/api/images/hero', async (req, res) => {
    try {
        const data = await readData();
        data.images.heroImage = null;
        await writeData(data);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting hero image:', error);
        res.status(500).json({ error: 'Failed to delete hero image' });
    }
});

app.delete('/api/images/background', async (req, res) => {
    try {
        const data = await readData();
        data.images.homeBackgroundImage = null;
        await writeData(data);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting background image:', error);
        res.status(500).json({ error: 'Failed to delete background image' });
    }
});

// Authentication endpoint (simple demo)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'admin123') {
        res.json({ success: true, token: 'demo-token', user: username });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Portfolio Server running on http://localhost:${PORT}`);
    console.log('Data will be synchronized across all devices!');
});