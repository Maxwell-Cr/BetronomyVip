const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require('body-parser');
const stripe = require('stripe')('sk_test_YOUR_STRIPE_SECRET_KEY');
const endpointSecret = 'whsec_YOUR_WEBHOOK_SECRET';

const app = express();
app.use(bodyParser.raw({ type: 'application/json' }));

const bot = new TelegramBot('7659647125:AAF_6pQfQAZw4Ab_1oQVW1niacQqd3IcE9Y', { polling: false });
const inviteLink = 'https://t.me/+wHrW2cF4Z5VmMDM0';
const telegramChatId = 'DEINE_TELEGRAM_CHAT_ID'; // Zum Testen: deine eigene Telegram-ID

app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const message = `🔥 Danke für deinen Kauf!\nHier ist dein VIP-Zugang:\n👉 ${inviteLink}`;
    bot.sendMessage(telegramChatId, message);
  }

  res.status(200).end();
});

app.listen(3000, () => console.log('Webhook server running on port 3000'));
