// Vercel Serverless Function for /api/images
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
    const defaultImages = {
        heroImage: null,
        homeBackgroundImage: null,
        backgroundOpacity: '50'
    };

    try {
        if (req.method === 'GET') {
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                const images = { ...defaultImages, ...(data.images || {}) };
                res.status(200).json(images);
            } catch (error) {
                res.status(200).json(defaultImages);
            }
        } else if (req.method === 'POST') {
            const imagesData = req.body;
            
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                data.images = { ...data.images, ...imagesData };
                await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
            } catch (error) {
                // Create new data file if it doesn't exist
                const newData = {
                    portfolio: [],
                    services: [],
                    about: {},
                    contact: {},
                    settings: {},
                    images: imagesData
                };
                await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
            }
            
            res.status(200).json({ success: true, message: 'Images updated successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}