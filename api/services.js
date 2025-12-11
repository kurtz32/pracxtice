// Vercel Serverless Function for /api/services
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
        const services = [
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

        res.status(200).json(services);
    } catch (error) {
        console.error('Error in /api/services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}