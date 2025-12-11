// Vercel Serverless Function for /api/health
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
        res.status(200).json({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            platform: 'Vercel Serverless Functions'
        });
    } catch (error) {
        console.error('Error in /api/health:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}