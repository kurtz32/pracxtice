// Vercel Serverless Function for /api/about
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const dataFilePath = path.join(process.cwd(), 'data.json');
    const defaultAbout = {
        name: 'Alex Chen',
        profession: 'Creative Graphic Designer',
        bio: 'Hello! I\'m Alex Chen, a passionate graphic designer with over 5 years of experience creating compelling visual identities, branding solutions, and digital experiences. I believe in the power of design to communicate, inspire, and transform.',
        projects: '150',
        clients: '50',
        experience: '5',
        skills: ['Brand Identity', 'Logo Design', 'Print Design', 'Digital Design', 'Adobe Creative Suite', 'Figma', 'UI/UX Design', 'Typography']
    };

    try {
        if (req.method === 'GET') {
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                const about = { ...defaultAbout, ...(data.about || {}) };
                res.status(200).json(about);
            } catch (error) {
                res.status(200).json(defaultAbout);
            }
        } else if (req.method === 'POST') {
            const aboutData = req.body;
            
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                data.about = { ...data.about, ...aboutData };
                await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
            } catch (error) {
                // Create new data file if it doesn't exist
                const newData = {
                    portfolio: [],
                    services: [],
                    about: aboutData,
                    contact: {},
                    settings: {},
                    images: {}
                };
                await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
            }
            
            res.status(200).json({ success: true, message: 'About section updated successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/about:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}