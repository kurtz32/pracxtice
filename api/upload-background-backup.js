// Backup background image upload endpoint
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'POST') {
            const body = await req.json();
            const { imageData } = body;
            
            if (!imageData) {
                res.status(400).json({ error: 'No image data provided' });
                return;
            }

            // For backup endpoint, we'll use a simple in-memory storage
            // In a real deployment, you'd want persistent storage
            global.backgroundImageData = imageData;
            
            res.status(200).json({ 
                success: true, 
                message: 'Background image uploaded successfully (backup endpoint)',
                imageData: imageData 
            });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Backup background upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}