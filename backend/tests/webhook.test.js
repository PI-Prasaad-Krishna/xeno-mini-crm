const request = require('supertest');
const express = require('express');
const webhookRouter = require('../src/routes/webhooks');
const Communication = require('../src/models/Communication');
const Campaign = require('../src/models/Campaign');

const app = express();
app.use(express.json());
app.use('/api/webhooks', webhookRouter);

jest.mock('../src/models/Communication');
jest.mock('../src/models/Campaign');

describe('Webhook Processing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update communication status and campaign stats correctly', async () => {
    const mockCommId = '507f1f77bcf86cd799439011';
    
    const mockComm = {
      _id: mockCommId,
      campaignId: '607f1f77bcf86cd799439011',
      status: 'SENT',
      statusHistory: [],
      save: jest.fn().mockResolvedValue(true)
    };

    Communication.findById.mockResolvedValue(mockComm);
    Campaign.findByIdAndUpdate.mockResolvedValue(true);

    const response = await request(app)
      .post('/api/webhooks/channel-receipt')
      .send({ communicationId: mockCommId, status: 'DELIVERED' });

    expect(response.status).toBe(200);
    expect(mockComm.status).toBe('DELIVERED');
    expect(mockComm.save).toHaveBeenCalled();
    expect(Campaign.findByIdAndUpdate).toHaveBeenCalledWith(
      mockComm.campaignId,
      { $inc: { 'stats.delivered': 1 } }
    );
  });
});
