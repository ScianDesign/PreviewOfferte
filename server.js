require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

// Middleware sicurezza
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://tuonome.github.io');
  res.header('Access-Control-Allow-Headers', 'X-API-KEY');
  next();
});

// Endpoint protetto
app.get('/posts', async (req, res) => {
  try {
    // Verifica chiave segreta
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      return res.status(401).send('Unauthorized');
    }

    // Richiesta a Telegram
    const response = await axios.get(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getChatHistory`,
      {
        params: {
          chat_id: process.env.CHANNEL,
          limit: 20
        }
      }
    );

    res.json(response.data.result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
