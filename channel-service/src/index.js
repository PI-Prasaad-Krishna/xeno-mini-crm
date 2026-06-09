const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3001/api/webhooks/channel-receipt';

// Mock Channel Service Delivery Endpoint
app.post('/api/send', (req, res) => {
  const { communicationId, customerId, channel, message } = req.body;
  
  if (!communicationId) {
    return res.status(400).json({ error: 'communicationId is required' });
  }

  // Acknowledge receipt immediately
  res.status(202).json({ message: 'Accepted for delivery' });

  // Simulate delivery process asynchronously
  simulateDeliveryLifeCycle(communicationId);
});

async function simulateDeliveryLifeCycle(communicationId) {
  // Wait a random time before sending SENT
  await sleep(randomMs(500, 2000));
  
  // 5% chance of failure right away
  if (Math.random() < 0.05) {
    await sendWebhook(communicationId, 'FAILED');
    return;
  }
  
  await sendWebhook(communicationId, 'SENT');

  // Wait before DELIVERED
  await sleep(randomMs(1000, 4000));
  await sendWebhook(communicationId, 'DELIVERED');

  // 60% chance to OPEN
  if (Math.random() < 0.6) {
    await sleep(randomMs(2000, 8000));
    await sendWebhook(communicationId, 'OPENED');

    // 30% chance to CLICK if opened
    if (Math.random() < 0.3) {
      await sleep(randomMs(3000, 10000));
      await sendWebhook(communicationId, 'CLICKED');
    }
  }
}

async function sendWebhook(communicationId, status) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ communicationId, status })
    });
    if (!response.ok) {
      console.log(`Webhook failed for ${communicationId} with status ${response.status}`);
    }
  } catch (err) {
    console.error('Failed to send webhook to CRM', err.message);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomMs(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Channel Service Stub running on port ${PORT}`);
});
