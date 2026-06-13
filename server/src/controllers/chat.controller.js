import { generateStreamToken } from "../config/stream.js";
export const getStreamToken = async (req, res) => {
    try {
        const token = await generateStreamToken(req.auth().userId);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error generating Stream token', error);
        res.status(500).json({ message: 'Error generating Stream token' });
    }
}