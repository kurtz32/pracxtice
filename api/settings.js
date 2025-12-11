// Vercel Serverless Function for /api/settings
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
        const settings = {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            portfolioTitle: 'Alex Chen - Graphic Designer Portfolio',
            portfolioDescription: 'A modern, responsive portfolio showcasing creative graphic design work and branding solutions.'
        };

        res.status(200).json(settings);
    } catch (error) {
        console.error('Error in /api/settings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}