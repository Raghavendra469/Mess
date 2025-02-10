const cron = require('node-cron');
const { generateRandomStreams } = require('../services/streamService');

// Schedule the task to run every minute
cron.schedule('* * * * *', () => {
    console.log('Running cron job to update streams...');
    generateRandomStreams();
});
