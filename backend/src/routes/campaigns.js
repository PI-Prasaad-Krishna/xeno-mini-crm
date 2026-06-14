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
    let customer;
    if (customerId && customerId !== 'replace_with_real_id') {
      customer = await Customer.findById(customerId);
    } else {
      customer = await Customer.findOne();
    }
    if (!customer) return res.status(404).json({ error: 'Customer not found. Seed database first.' });

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

    // Respond immediately so the frontend doesn't timeout during large dispatches
    res.json({ message: 'Campaign dispatch started', campaignId: campaign._id });

    // Background processing
    setImmediate(async () => {
      try {
        const audience = await Customer.find(campaign.segmentQuery);
        const channelServiceUrl = process.env.CHANNEL_SERVICE_URL || 'http://localhost:3002/api/send';
        let sentCount = 0;
        
        // Process in batches or sequentially. Sequentially allows cool real-time dashboard updates!
        for (const customer of audience) {
          const comm = new Communication({
            campaignId: campaign._id,
            customerId: customer._id,
            channel: 'WHATSAPP',
            message: campaign.messageTemplate.replace('{name}', customer.name),
            status: 'PENDING'
          });
          await comm.save();

          // Await the fetch to prevent Out-Of-Memory (OOM) crashes on Render Free Tier
          try {
            await fetch(channelServiceUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                communicationId: comm._id.toString(),
                customerId: customer._id.toString(),
                channel: comm.channel,
                message: comm.message
              })
            });
          } catch (err) {
            console.error('Dispatch warning', err.message);
          }
          
          sentCount++;
        }
        
        // Finalize status
        const finalStatus = sentCount > 0 ? 'SENT' : 'FAILED';
        await Campaign.findByIdAndUpdate(campaign._id, {
          $set: { 
            'stats.sent': sentCount,
            status: finalStatus
          }
        });

        const io = req.app.get('io');
        if (io) {
          io.emit('campaign-status-update', {
            campaignId: campaign._id,
            status: finalStatus
          });
        }
      } catch (err) {
        console.error('Background dispatch error:', err);
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
