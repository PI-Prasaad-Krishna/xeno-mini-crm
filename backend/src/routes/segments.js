const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MONGODB_QUERY_PROMPT = `
You are a CRM Data Assistant. Your job is to translate a marketer's natural language audience segment request into a valid MongoDB query for a Mongoose 'Customer' model.

The schema for Customer is:
- name (String)
- email (String)
- phone (String)
- lifetimeValue (Number)
- tags (Array of Strings)
- createdAt (Date)

Example:
User: "Shoppers with lifetime value over 1000"
Output: {"lifetimeValue": {"$gt": 1000}}

User: "Customers tagged with 'VIP' or 'Coffee'"
Output: {"tags": {"$in": ["VIP", "Coffee"]}}

Output ONLY valid JSON. Do not use markdown blocks. Do not explain. Just the JSON.
`;

router.post('/query', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ error: 'Description is required' });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${MONGODB_QUERY_PROMPT}\nUser: "${description}"\nOutput:`,
      config: {
        temperature: 0.1,
      }
    });

    let rawOutput = response.text;
    rawOutput = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let mongoQuery;
    try {
      mongoQuery = JSON.parse(rawOutput);
    } catch (parseErr) {
      return res.status(500).json({ error: 'AI failed to generate a valid JSON query', rawOutput });
    }

    // Run the query to get a preview of the audience
    const audience = await Customer.find(mongoQuery).limit(50);
    const totalCount = await Customer.countDocuments(mongoQuery);

    res.json({
      segmentQuery: mongoQuery,
      totalCount,
      preview: audience
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
