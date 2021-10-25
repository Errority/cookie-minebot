const mineflayer = require('mineflayer');

module.exports = bot => {
    bot.on('spawn', () => {
        bot.chat('Hallo!');
    });
};