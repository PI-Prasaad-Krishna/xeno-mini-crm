const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

mongoose.connect('mongodb://localhost:27017/xeno_crm')
  .then(async () => {
    console.log('Connected to MongoDB. Seeding data...');
    
    await Customer.deleteMany({});
    await Order.deleteMany({});

    const customers = [];
    for (let i = 1; i <= 100; i++) {
      customers.push({
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        phone: `+1555010${i.toString().padStart(3, '0')}`,
        tags: Math.random() > 0.8 ? ['VIP'] : Math.random() > 0.5 ? ['Coffee'] : ['Tea'],
        lifetimeValue: Math.floor(Math.random() * 1000)
      });
    }

    const insertedCustomers = await Customer.insertMany(customers);
    console.log(`Inserted ${insertedCustomers.length} customers.`);

    const orders = [];
    for (const customer of insertedCustomers) {
      if (Math.random() > 0.3) {
        orders.push({
          customerId: customer._id,
          totalAmount: Math.floor(Math.random() * 200) + 10,
          items: [{ name: 'Test Product', price: 10, quantity: 1 }]
        });
      }
    }
    
    const insertedOrders = await Order.insertMany(orders);
    console.log(`Inserted ${insertedOrders.length} orders.`);

    console.log('Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error', err);
    process.exit(1);
  });
