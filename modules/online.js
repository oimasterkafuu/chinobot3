const { bot } = require('../index');

bot.on('system.online', () => {
    console.log(`Logged in as ${bot.uin}`);
});