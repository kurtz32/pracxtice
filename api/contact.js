// Vercel Serverless Function for /api/contact
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
        const contact = {
            email: 'alex.chen@email.com',
            phone: '+1 (555) 123-4567',
            location: 'New York, NY',
            behance: '',
            dribbble: '',
            instagram: '',
            linkedin: ''
        };

        res.status(200).json(contact);
    } catch (error) {
        console.error('Error in /api/contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}