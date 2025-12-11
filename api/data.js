// Vercel Serverless Function for /api/data
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const dataFilePath = path.join(process.cwd(), 'data.json');

    try {
        // Default data structure
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

        if (req.method === 'GET') {
            try {
                // Try to read existing data file
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const existingData = JSON.parse(fileData);
                
                // Merge with default data to ensure all fields exist
                const mergedData = {
                    ...defaultData,
                    ...existingData,
                    portfolio: existingData.portfolio || defaultData.portfolio,
                    services: existingData.services || defaultData.services,
                    about: { ...defaultData.about, ...existingData.about },
                    contact: { ...defaultData.contact, ...existingData.contact },
                    settings: { ...defaultData.settings, ...existingData.settings },
                    images: { ...defaultData.images, ...existingData.images }
                };
                
                res.status(200).json(mergedData);
            } catch (error) {
                // If file doesn't exist or can't be read, return default data
                console.log('Data file not found or invalid, using defaults');
                res.status(200).json(defaultData);
            }
        } else if (req.method === 'POST') {
            // For updates, merge the incoming data with existing data
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const existingData = JSON.parse(fileData);
                
                const incomingData = req.body;
                const updatedData = {
                    ...existingData,
                    ...incomingData,
                    portfolio: incomingData.portfolio || existingData.portfolio,
                    services: incomingData.services || existingData.services,
                    about: { ...existingData.about, ...incomingData.about },
                    contact: { ...existingData.contact, ...incomingData.contact },
                    settings: { ...existingData.settings, ...incomingData.settings },
                    images: { ...existingData.images, ...incomingData.images }
                };
                
                await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2));
                res.status(200).json({ success: true, message: 'Data updated successfully' });
            } catch (error) {
                // If file doesn't exist, create it with the incoming data
                const incomingData = req.body;
                const newData = {
                    ...defaultData,
                    ...incomingData,
                    portfolio: incomingData.portfolio || defaultData.portfolio,
                    services: incomingData.services || defaultData.services,
                    about: { ...defaultData.about, ...incomingData.about },
                    contact: { ...defaultData.contact, ...incomingData.contact },
                    settings: { ...defaultData.settings, ...incomingData.settings },
                    images: { ...defaultData.images, ...incomingData.images }
                };
                
                await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
                res.status(200).json({ success: true, message: 'Data created successfully' });
            }
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error in /api/data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}