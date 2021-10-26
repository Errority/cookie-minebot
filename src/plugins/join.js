const mineflayer = require('mineflayer');

/**
 * @param {mineflayer.Bot} bot 
 */
module.exports = bot => {
    bot.on('spawn', () => {
        bot.chat('Hallo!');
    });
};