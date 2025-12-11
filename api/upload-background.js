// Vercel Serverless Function for /api/upload/background
import { storage } from './storage.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'POST') {
            const body = await readBody(req);
            const { imageData, mimeType } = body;
            
            if (!imageData) {
                res.status(400).json({ error: 'No image data provided' });
                return;
            }

            // Get current images data
            const currentData = await storage.readData();
            const imagesData = currentData.images || {};

            // Update background image
            imagesData.homeBackgroundImage = imageData;

            // Save updated images data
            const success = await storage.writeData({ images: imagesData });
            
            if (success) {
                res.status(200).json({ 
                    success: true, 
                    message: 'Background image uploaded successfully',
                    imageData: imageData,
                    environment: process.env.VERCEL ? 'serverless' : 'local'
                });
            } else {
                res.status(500).json({ error: 'Failed to save image data' });
            }
        } else if (req.method === 'DELETE') {
            // Handle background image deletion
            const currentData = await storage.readData();
            const imagesData = currentData.images || {};

            // Clear background image
            imagesData.homeBackgroundImage = null;

            // Save updated images data
            const success = await storage.writeData({ images: imagesData });
            
            if (success) {
                res.status(200).json({ 
                    success: true, 
                    message: 'Background image deleted successfully'
                });
            } else {
                res.status(500).json({ error: 'Failed to delete image data' });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/upload/background:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Helper function to read request body
async function readBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    const body = Buffer.concat(chunks).toString();
    
    try {
        return JSON.parse(body);
    } catch {
        return {};
    }
}