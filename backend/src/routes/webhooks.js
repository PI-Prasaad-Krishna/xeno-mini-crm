const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Communication = require('../models/Communication');

// Webhook endpoint to receive status updates from the channel service
router.post('/channel-receipt', async (req, res) => {
  try {
    const { communicationId, status } = req.body;
    
    if (!communicationId || !status) {
      return res.status(400).json({ error: 'communicationId and status are required' });
    }

    const comm = await Communication.findById(communicationId);
    if (!comm) {
      return res.status(404).json({ error: 'Communication not found' });
    }

    // Don't downgrade status (e.g. DELIVERED back to SENT)
    const validTransitions = {
      'PENDING': ['SENT', 'FAILED'],
      'SENT': ['DELIVERED', 'FAILED'],
      'DELIVERED': ['OPENED'],
      'OPENED': ['CLICKED'],
      'CLICKED': [],
      'FAILED': []
    };

    if (!validTransitions[comm.status].includes(status) && comm.status !== status) {
      // In a real system, out-of-order events can happen. For now, we accept it if it's an advancement.
    }

    comm.status = status;
    comm.statusHistory.push({ status, timestamp: new Date() });
    await comm.save();

    // Update campaign stats atomically
    const statUpdate = {};
    const lowerStatus = status.toLowerCase(); // 'sent', 'delivered', 'opened', 'clicked', 'failed'
    
    if (['sent', 'delivered', 'opened', 'clicked', 'failed'].includes(lowerStatus)) {
      statUpdate[`stats.${lowerStatus}`] = 1;
      await Campaign.findByIdAndUpdate(comm.campaignId, { $inc: statUpdate });
    }

    res.json({ message: 'Receipt processed successfully' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
