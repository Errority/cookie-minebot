const mineflayer = require('mineflayer');
const { owner } = require('../../config');

/**
 * @param {mineflayer.Bot} bot 
 */
module.exports = bot => {
    let mcdata, mining;
    bot.once('spawn', () => {
        mcdata = require('minecraft-data')(bot.version);
    });

    bot.on('chat', (name, msg) => {
        const args = msg.split(' ');
        if (args[0] != 'mine' || name != owner) return;

        const targetBlock = mcdata.blocksByName[args[1]];
        if (!targetBlock) return bot.chat('Block does not exist!');
    });
};