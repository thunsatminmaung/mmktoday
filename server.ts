import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import { createServer as createViteServer } from 'vite';

const app = express();
const port = 3000;

interface ExchangeRate {
  currency: string;
  buy: string;
  sell: string;
}

app.get('/api/rates', async (req, res) => {
  try {
    const response = await axios.get('https://www.hellolinker.com/');
    const $ = cheerio.load(response.data);
    
    const rates: ExchangeRate[] = [];
    
    // Extract exchange rates from the HelloLinker website
    // Note: Update selectors based on actual HTML structure
    $('.exchange-rate-table tr').each((i, elem) => {
      const currency = $(elem).find('.currency').text().trim();
      const buy = $(elem).find('.buy-rate').text().trim();
      const sell = $(elem).find('.sell-rate').text().trim();
      
      if (currency && buy && sell) {
        rates.push({ currency, buy, sell });
      }
    });
    
    res.json(rates);
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({ error: 'Failed to fetch exchange rates' });
  }
});

// Create Vite server in middleware mode
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa'
});

app.use(vite.middlewares);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});