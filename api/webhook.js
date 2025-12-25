// Telegram Mini App Bot Webhook - Vercel Serverless Function
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8081845602:AAFlbKEWn4mWdZanUcym7MxKDy6DBjgPkDQ';
const MINI_APP_URL = process.env.MINI_APP_URL || 'https://telegram-miniapp-store-2025-k2taesp9j.vercel.app';

// Telegram API base URL
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Product catalog
const PRODUCTS = [
  { id: 1, name: 'Storage Plus', emoji: '📦', price: '$4.99' },
  { id: 2, name: 'Support Pack', emoji: '🆘', price: '$14.99' },
  { id: 3, name: 'Analytics', emoji: '📊', price: '$7.99' },
  { id: 4, name: 'Export Bundle', emoji: '📤', price: '$24.99' }
];

// Send message to Telegram
async function sendTelegramMessage(chatId, text, options = {}) {
  const url = `${TELEGRAM_API}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    ...options
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return { ok: false, error: error.message };
  }
}

// Handle webhook requests
export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(200).json({ message: 'Mini App Bot is running' });
  }

  try {
    const update = req.body;
    
    // Handle /start command
    if (update.message && update.message.text === '/start') {
      const chatId = update.message.chat.id;
      const firstName = update.message.from.first_name || 'User';
      
      const response = await sendTelegramMessage(
        chatId,
        `🛍️ Welcome to Mini App Store, ${firstName}!\n\nClick the button below to open the app.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{
                text: '🛒 Open Store',
                web_app: { url: MINI_APP_URL }
              }]
            ]
          }
        }
      );
      
      console.log('Message sent:', response);
    }
    
    // Handle purchase notifications from webapp
    if (update.message && update.message.text && update.message.text.includes('purchase')) {
      const chatId = update.message.chat.id;
      await sendTelegramMessage(
        chatId,
        '✅ Thank you for your purchase!\n\nYour order has been received.'
      );
    }
    
    // Acknowledge the update
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Optional: Handler for GET requests to set webhook
export async function getWebhookUrl() {
  const webhookUrl = `https://telegram-miniapp-store.vercel.app/api/webhook`;
  const setWebhookUrl = `${TELEGRAM_API}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
  
  try {
    const response = await fetch(setWebhookUrl);
    return await response.json();
  } catch (error) {
    console.error('Error setting webhook:', error);
    return { ok: false, error: error.message };
  }
}
