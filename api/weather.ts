import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

const KMA_API_BASE_URL = 'http://apis.data.go.kr';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const KMA_API_KEY = process.env.KMA_API_KEY;

  console.log('--- API Proxy Function Start ---');

  if (!KMA_API_KEY || KMA_API_KEY.trim().length === 0) {
    const errorMessage = 'KMA_API_KEY environment variable is not set or is empty on Vercel.';
    console.error(errorMessage);
    res.status(500).json({ message: errorMessage });
    return;
  }
  console.log(`KMA_API_KEY is present. Length: ${KMA_API_KEY.length}`);

  const { pathname, search } = new URL(req.url, `https://${req.headers.host}`);
  const targetPath = pathname.replace('/api/weather', '');
  const targetUrl = `${KMA_API_BASE_URL}${targetPath}${search}`;
  
  try {
    // Append the raw, unmodified service key
    const finalUrl = `${targetUrl}&serviceKey=${KMA_API_KEY}`;

    console.log(`Forwarding final request to: ${finalUrl}`);

    const { data, status } = await axios.get(finalUrl);

    console.log(`Received ${status} response from KMA API.`);
    
    res.status(status).json(data);
  } catch (error) {
    console.error('--- Error proxying to KMA API ---');
    if (axios.isAxiosError(error)) {
      console.error('Axios error status:', error.response?.status);
      console.error('Axios error data:', JSON.stringify(error.response?.data, null, 2));
      res.status(error.response?.status || 500).json(error.response?.data);
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: 'An unexpected error occurred while proxying.' });
    }
  } finally {
    console.log('--- API Proxy Function End ---');
  }
}