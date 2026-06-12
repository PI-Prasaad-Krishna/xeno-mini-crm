const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Customer = require('./models/Customer');
const Order = require('./models/Order');
const Campaign = require('./models/Campaign');
const Communication = require('./models/Communication');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/xeno_crm')
  .then(async () => {
    console.log('Connected to MongoDB. Wiping existing data...');
    
    await Customer.deleteMany({});
    await Order.deleteMany({});
    await Campaign.deleteMany({});
    await Communication.deleteMany({});

    console.log('Seeding 10,000 Realistic Shopper Profiles...');
    const BATCH_SIZE = 1000;
    const TOTAL_CUSTOMERS = 10000;
    let insertedCustomersCount = 0;

    const availableTags = ['VIP', 'Coffee', 'Tea', 'Apparel', 'Activewear', 'Summer Sale', 'Winter Core', 'Loyalty Member', 'Churn Risk', 'High Spender', 'Discount Seeker', 'Beauty', 'Skincare'];

    for (let i = 0; i < TOTAL_CUSTOMERS / BATCH_SIZE; i++) {
      const batch = [];
      for (let j = 0; j < BATCH_SIZE; j++) {
        const numTags = faker.number.int({ min: 1, max: 4 });
        const tags = faker.helpers.arrayElements(availableTags, numTags);

        batch.push({
          name: faker.person.fullName(),
          email: `${faker.internet.username().toLowerCase()}_${i}_${j}@example.com`,
          phone: faker.phone.number(),
          tags: tags,
          lifetimeValue: faker.number.int({ min: 10, max: 5000 }),
          createdAt: faker.date.past({ years: 2 })
        });
      }
      const inserted = await Customer.insertMany(batch);
      insertedCustomersCount += inserted.length;
      console.log(`Progress: ${insertedCustomersCount} / ${TOTAL_CUSTOMERS} customers inserted...`);
    }

    console.log('Seeding complete! You now have a massive, realistic dataset to query in the Audience Terminal.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error', err);
    process.exit(1);
  });
