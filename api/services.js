// Vercel Serverless Function for /api/services
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
    const defaultServices = [
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
    ];

    try {
        if (req.method === 'GET') {
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                const services = data.services || defaultServices;
                res.status(200).json(services);
            } catch (error) {
                res.status(200).json(defaultServices);
            }
        } else if (req.method === 'POST') {
            const servicesData = req.body;
            
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                data.services = servicesData;
                await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
            } catch (error) {
                // Create new data file if it doesn't exist
                const newData = {
                    portfolio: [],
                    services: servicesData,
                    about: {},
                    contact: {},
                    settings: {},
                    images: {}
                };
                await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
            }
            
            res.status(200).json({ success: true, message: 'Services updated successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}