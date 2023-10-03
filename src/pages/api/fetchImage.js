import axios from 'axios';

export default async function handler(req, res) {
  const { imageUrl } = req.query;
  
  try {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(imageResponse.data).toString('base64');
    res.status(200).json({ data: `data:${imageResponse.headers['content-type']};base64,${base64}` });
  } catch (error) {
    console.error('Failed to fetch image:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
}