// Vercel Serverless Function for /api/portfolio
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
    const defaultPortfolio = [
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
    ];

    try {
        if (req.method === 'GET') {
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                const portfolio = data.portfolio || defaultPortfolio;
                res.status(200).json(portfolio);
            } catch (error) {
                res.status(200).json(defaultPortfolio);
            }
        } else if (req.method === 'POST') {
            const portfolioData = req.body;
            
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                data.portfolio = portfolioData;
                await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
            } catch (error) {
                // Create new data file if it doesn't exist
                const newData = {
                    portfolio: portfolioData,
                    services: [],
                    about: {},
                    contact: {},
                    settings: {},
                    images: {}
                };
                await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
            }
            
            res.status(200).json({ success: true, message: 'Portfolio updated successfully' });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/portfolio:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}