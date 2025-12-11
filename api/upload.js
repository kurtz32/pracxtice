// Vercel Serverless Function for /api/upload/* endpoints
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
        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathSegments = url.pathname.split('/');
        const uploadType = pathSegments[pathSegments.length - 1]; // 'hero' or 'background'

        if (req.method === 'POST') {
            // Handle file upload
            const formData = await parseFormData(req);
            const imageFile = formData.get('image');
            
            if (!imageFile) {
                res.status(400).json({ error: 'No image file provided' });
                return;
            }

            // Convert file to base64 data URL
            const imageBuffer = await imageFile.arrayBuffer();
            const base64 = Buffer.from(imageBuffer).toString('base64');
            const mimeType = imageFile.type || 'image/jpeg';
            const dataUrl = `data:${mimeType};base64,${base64}`;

            // Get current images data
            const currentData = await storage.readData();
            const imagesData = currentData.images || {};

            // Update the appropriate image
            if (uploadType === 'hero') {
                imagesData.heroImage = dataUrl;
            } else if (uploadType === 'background') {
                imagesData.homeBackgroundImage = dataUrl;
            } else {
                res.status(400).json({ error: 'Invalid upload type' });
                return;
            }

            // Save updated images data
            const success = await storage.writeData({ images: imagesData });
            
            if (success) {
                res.status(200).json({ 
                    success: true, 
                    message: `${uploadType} image uploaded successfully`,
                    imageData: dataUrl,
                    environment: process.env.VERCEL ? 'serverless' : 'local'
                });
            } else {
                res.status(500).json({ error: 'Failed to save image data' });
            }
        } else if (req.method === 'DELETE') {
            // Handle image deletion
            const currentData = await storage.readData();
            const imagesData = currentData.images || {};

            // Clear the appropriate image
            if (uploadType === 'hero') {
                imagesData.heroImage = null;
            } else if (uploadType === 'background') {
                imagesData.homeBackgroundImage = null;
            } else {
                res.status(400).json({ error: 'Invalid upload type' });
                return;
            }

            // Save updated images data
            const success = await storage.writeData({ images: imagesData });
            
            if (success) {
                res.status(200).json({ 
                    success: true, 
                    message: `${uploadType} image deleted successfully`
                });
            } else {
                res.status(500).json({ error: 'Failed to delete image data' });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/upload:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Helper function to parse form data
async function parseFormData(req) {
    const contentType = req.headers['content-type'] || '';
    
    if (contentType.includes('multipart/form-data')) {
        // For multipart form data, we need to use a different approach
        // For simplicity, we'll handle JSON for now
        const body = await readBody(req);
        return {
            get: (field) => {
                if (field === 'image' && body.imageData) {
                    return {
                        arrayBuffer: async () => Buffer.from(body.imageData, 'base64'),
                        type: body.mimeType || 'image/jpeg'
                    };
                }
                return null;
            }
        };
    } else {
        // Handle as JSON
        const body = await readBody(req);
        return {
            get: (field) => {
                if (field === 'image' && body.imageData) {
                    return {
                        arrayBuffer: async () => Buffer.from(body.imageData, 'base64'),
                        type: body.mimeType || 'image/jpeg'
                    };
                }
                return null;
            }
        };
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