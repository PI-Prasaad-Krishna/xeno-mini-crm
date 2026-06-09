const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Order = require('../models/Order');

// Ingest a batch of customers
router.post('/customers', async (req, res) => {
  try {
    const customers = req.body.customers; // Array of customer objects
    if (!customers || !Array.isArray(customers)) {
      return res.status(400).json({ error: 'customers array is required' });
    }
    
    const result = await Customer.insertMany(customers, { ordered: false });
    res.status(201).json({ message: `Ingested ${result.length} customers`, result });
  } catch (error) {
    // If ordered: false, it might still insert some and throw an error for duplicates
    res.status(500).json({ error: error.message });
  }
});

// Ingest a batch of orders
router.post('/orders', async (req, res) => {
  try {
    const orders = req.body.orders; // Array of order objects
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ error: 'orders array is required' });
    }

    const result = await Order.insertMany(orders);
    
    // Update customer lifetime values
    for (const order of orders) {
      await Customer.findByIdAndUpdate(
        order.customerId,
        { $inc: { lifetimeValue: order.totalAmount } }
      );
    }
    
    res.status(201).json({ message: `Ingested ${result.length} orders`, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
