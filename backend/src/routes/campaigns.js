const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');
const Communication = require('../models/Communication');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Get all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get campaign stats
router.get('/:id/stats', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    
    // You could also calculate this directly from Communications if you wanted real-time consistency
    // but caching in campaign.stats is fine for a CRM scale simulation
    res.json({ stats: campaign.stats, status: campaign.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create campaign
router.post('/create', async (req, res) => {
  try {
    const { name, segmentDescription, segmentQuery, messageTemplate } = req.body;
    const campaign = new Campaign({
      name,
      segmentDescription,
      segmentQuery,
      messageTemplate
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Draft personalized message for a preview
router.post('/draft', async (req, res) => {
  try {
    const { messageTemplate, customerId } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const prompt = `You are a personalized marketing assistant. Customize this template for the shopper.
Template: "${messageTemplate}"
Shopper Profile: ${JSON.stringify({ name: customer.name, tags: customer.tags, lifetimeValue: customer.lifetimeValue })}

Output ONLY the final message content, no quotes, no explanations. Make it engaging.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.7 }
    });

    res.json({ message: response.text.trim() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send Campaign
router.post('/:id/send', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    
    if (campaign.status !== 'DRAFT') {
      return res.status(400).json({ error: 'Campaign already sent or sending' });
    }

    campaign.status = 'SENDING';
    await campaign.save();

    // In a real system, this would be queued in a background job like BullMQ or SQS
    const audience = await Customer.find(campaign.segmentQuery);
    
    // We mock the dispatcher synchronously here for simplicity, but send async requests
    // to the channel service.
    
    const channelServiceUrl = process.env.CHANNEL_SERVICE_URL || 'http://localhost:3002/api/send';
    
    let sentCount = 0;
    
    // For large scale, we should batch.
    for (const customer of audience) {
      // Create communication record
      const comm = new Communication({
        campaignId: campaign._id,
        customerId: customer._id,
        channel: 'WHATSAPP', // Hardcoded channel for demo
        message: campaign.messageTemplate.replace('{name}', customer.name), // Simplistic fallback
        status: 'PENDING'
      });
      await comm.save();

      // Dispatch to channel service
      try {
        fetch(channelServiceUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            communicationId: comm._id.toString(),
            customerId: customer._id.toString(),
            channel: comm.channel,
            message: comm.message
          })
        }).catch(err => console.error('Failed to dispatch to channel service', err));
        
        sentCount++;
      } catch (e) {
        console.error('Dispatch error', e);
      }
    }
    
    // Initial stats
    campaign.stats.sent = sentCount;
    await campaign.save();

    res.json({ message: 'Campaign dispatch started', sentCount, campaignId: campaign._id });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
