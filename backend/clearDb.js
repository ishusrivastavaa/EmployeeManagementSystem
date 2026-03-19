const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/payroll')
  .then(async () => {
    await mongoose.connection.dropDatabase();
    console.log('Database cleared successfully');
    process.exit(0);
  })
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
