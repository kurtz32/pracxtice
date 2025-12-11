// Vercel Serverless Function for /api/portfolio
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
        const portfolio = [
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

        res.status(200).json(portfolio);
    } catch (error) {
        console.error('Error in /api/portfolio:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}