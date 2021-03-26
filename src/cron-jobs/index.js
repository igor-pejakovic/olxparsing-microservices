var cron = require('node-cron')
const hitSnapshot = require('./hit-snapshot')

cron.schedule('*/10 * * * *', async () => {
    hitSnapshot.run()
  });