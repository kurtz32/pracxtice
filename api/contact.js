// Vercel Serverless Function for /api/contact
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
    const defaultContact = {
        email: 'alex.chen@email.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        behance: '',
        dribbble: '',
        instagram: '',
        linkedin: ''
    };

    try {
        if (req.method === 'GET') {
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                const contact = { ...defaultContact, ...(data.contact || {}) };
                res.status(200).json(contact);
            } catch (error) {
                res.status(200).json(defaultContact);
            }
        } else if (req.method === 'POST') {
            const contactData = req.body;
            
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                data.contact = { ...data.contact, ...contactData };
                await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
            } catch (error) {
                // Create new data file if it doesn't exist
                const newData = {
                    portfolio: [],
                    services: [],
                    about: {},
                    contact: contactData,
                    settings: {},
                    images: {}
                };
                await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
            }
            
            res.status(200).json({ success: true, message: 'Contact information updated successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}