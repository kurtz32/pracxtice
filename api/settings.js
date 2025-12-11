// Vercel Serverless Function for /api/settings
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
    const defaultSettings = {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        portfolioTitle: 'Alex Chen - Graphic Designer Portfolio',
        portfolioDescription: 'A modern, responsive portfolio showcasing creative graphic design work and branding solutions.'
    };

    try {
        if (req.method === 'GET') {
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                const settings = { ...defaultSettings, ...(data.settings || {}) };
                res.status(200).json(settings);
            } catch (error) {
                res.status(200).json(defaultSettings);
            }
        } else if (req.method === 'POST') {
            const settingsData = req.body;
            
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                data.settings = { ...data.settings, ...settingsData };
                await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
            } catch (error) {
                // Create new data file if it doesn't exist
                const newData = {
                    portfolio: [],
                    services: [],
                    about: {},
                    contact: {},
                    settings: settingsData,
                    images: {}
                };
                await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
            }
            
            res.status(200).json({ success: true, message: 'Settings updated successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}