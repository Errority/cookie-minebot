const Bot = require('../lib/Bot');

const bot = new Bot();

bot.on('ready', () => {
    bot.followNearestEntity('player');
    for (let i = 0; i < 100; i++) {
        bot.bot.chat('d');
    }
});