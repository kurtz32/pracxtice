// Vercel Serverless Function for /api/contact
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
        if (req.method === 'GET') {
            const data = await storage.readData();
            res.status(200).json(data.contact);
        } else if (req.method === 'POST') {
            const contactData = req.body;
            const success = await storage.writeData({ contact: contactData });
            
            if (success) {
                res.status(200).json({ 
                    success: true, 
                    message: 'Contact information updated successfully',
                    environment: process.env.VERCEL ? 'serverless' : 'local'
                });
            } else {
                res.status(500).json({ error: 'Failed to save data' });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}