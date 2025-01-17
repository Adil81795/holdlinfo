import express from 'express';
import fetch from 'node-fetch';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = 3000;


const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'hodlinfo',
    password: 'your_password',
    port: 5432,
});


app.get('/fetch-and-store', async (req, res) => {
    try {
   
        const response = await fetch('https://api.wazirx.com/api/v2/tickers');
        const tickers = await response.json();

        const top10Tickers = Object.values(tickers).slice(0, 10);
        
        const client = await pool.connect();
        await Promise.all(top10Tickers.map(async ticker => {
            const { name, last, buy, sell, volume, base_unit } = ticker;
            const queryText = 'INSERT INTO tickers(name, last, buy, sell, volume, base_unit) VALUES($1, $2, $3, $4, $5, $6)';
            const values = [name, last, buy, sell, volume, base_unit];
            await client.query(queryText, values);
        }));
        client.release();

        res.send('Data fetched and stored successfully.');
    } catch (error) {
        console.error('Error fetching or storing data:', error);
        res.status(500).send('Error fetching or storing data');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
