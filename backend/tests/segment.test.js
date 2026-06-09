// In a real scenario, we'd mock the @google/genai package to avoid real API calls.
// Since we want to just test the parser logic, we can write a simple test ensuring the prompt format works.

const { GoogleGenAI } = require('@google/genai');

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn().mockResolvedValue({
            text: '{"tags": {"$in": ["Coffee"]}}'
          })
        }
      };
    })
  };
});

const express = require('express');
const request = require('supertest');
const segmentsRouter = require('../src/routes/segments');
const Customer = require('../src/models/Customer');

const app = express();
app.use(express.json());
process.env.GEMINI_API_KEY = 'mock_key';
app.use('/api/segments', segmentsRouter);

jest.mock('../src/models/Customer');

describe('AI Segmentation Parser', () => {
  it('should translate natural language into mongodb query JSON', async () => {
    Customer.find.mockReturnValue({
      limit: jest.fn().mockResolvedValue([{ name: 'Test' }])
    });
    Customer.countDocuments.mockResolvedValue(1);

    const res = await request(app)
      .post('/api/segments/query')
      .send({ description: 'Shoppers who bought coffee' });

    expect(res.status).toBe(200);
    expect(res.body.segmentQuery).toEqual({ tags: { $in: ['Coffee'] } });
    expect(res.body.totalCount).toBe(1);
  });
});
