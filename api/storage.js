// Universal storage solution for both local and Vercel environments
import { promises as fs } from 'fs';
import path from 'path';

// Check if we're in a serverless environment
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

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

// In-memory storage for serverless environments
let memoryStorage = { ...defaultData };

export const storage = {
    async readData() {
        if (isServerless) {
            // Return memory storage for serverless
            return memoryStorage;
        } else {
            // File system for local development
            const dataFilePath = path.join(process.cwd(), 'data.json');
            try {
                const fileData = await fs.readFile(dataFilePath, 'utf8');
                const data = JSON.parse(fileData);
                return {
                    ...defaultData,
                    ...data,
                    portfolio: data.portfolio || defaultData.portfolio,
                    services: data.services || defaultData.services,
                    about: { ...defaultData.about, ...data.about },
                    contact: { ...defaultData.contact, ...data.contact },
                    settings: { ...defaultData.settings, ...data.settings },
                    images: { ...defaultData.images, ...data.images }
                };
            } catch (error) {
                return defaultData;
            }
        }
    },

    async writeData(data) {
        if (isServerless) {
            // Update memory storage for serverless
            memoryStorage = { ...memoryStorage, ...data };
            return true;
        } else {
            // File system for local development
            const dataFilePath = path.join(process.cwd(), 'data.json');
            try {
                const existingData = await this.readData();
                const updatedData = {
                    ...existingData,
                    ...data,
                    portfolio: data.portfolio || existingData.portfolio,
                    services: data.services || existingData.services,
                    about: { ...existingData.about, ...data.about },
                    contact: { ...existingData.contact, ...data.contact },
                    settings: { ...existingData.settings, ...data.settings },
                    images: { ...existingData.images, ...data.images }
                };
                await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2));
                return true;
            } catch (error) {
                console.error('Error writing data:', error);
                return false;
            }
        }
    },

    getDefaultData() {
        return defaultData;
    }
};