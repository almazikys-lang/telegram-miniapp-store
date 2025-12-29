require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN || '8081845602:AAFlbKEWn4mWdZanUcym7MxKDy6DBjgPkDQ');
const app = express();

app.use(express.json());

const MINI_APP_URL = process.env.MINI_APP_URL || 'https://telegram-miniapp-store-2025.vercel.app';const PRODUCTS = [
  { id: 1, name: 'Storage Plus', emoji: '📦', price: '$4.99' },
  { id: 2, name: 'Support Pack', emoji: '🆘', price: '$14.99' },
  { id: 3, name: 'Analytics', emoji: '📊', price: '$7.99' },
  { id: 4, name: 'Export Bundle', emoji: '📤', price: '$24.99' }
];

// /start command
bot.start(ctx => {
  ctx.reply('🛍️ Welcome to Mini App Store!', {
    reply_markup: {
      inline_keyboard: [
        [{
          text: '🛒 Open Store',
          web_app: { url: MINI_APP_URL }
        }]
      ]
    }
  });
});

// Handle purchase notification
app.post('/api/purchase', (req, res) => {
  const { userId, productId, timestamp } = req.body;
  const product = PRODUCTS.find(p => p.id === productId);
  if (product) {
    console.log(`Purchase: ${product.name} by user ${userId}`);
    res.json({ success: true, message: 'Purchase recorded' });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

// Catch-all handler
bot.catch(err => console.error('Bot error:', err));

// Start bot
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

bot.launch();
console.log('Bot started...');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
