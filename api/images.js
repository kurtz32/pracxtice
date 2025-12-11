// Vercel Serverless Function for /api/images
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
        const images = {
            heroImage: null,
            homeBackgroundImage: null,
            backgroundOpacity: '50'
        };

        res.status(200).json(images);
    } catch (error) {
        console.error('Error in /api/images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}