var cron = require('node-cron')
const hitSnapshot = require('./hit-snapshot')

cron.schedule('*/15 * * * *', async () => {
    hitSnapshot.run()
  });