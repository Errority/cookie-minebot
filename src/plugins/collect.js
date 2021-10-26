const { owner } = require('../../config');
const mineflayer = require('mineflayer');

/**
 * @param {mineflayer.Bot} bot 
 */
module.exports = bot => {
    let mcdata;

    bot.once('spawn', () => {
        mcdata = require('minecraft-data')(bot.version);
    });

    bot.on('chat', (name, msg) => {
        const args = msg.split(' ');
        if (args[0] != 'collect' || name != owner) return;

        const targetBlock = mcdata.blocksByName[args[1]];
        if (!targetBlock) return bot.chat('Block does not exist!');

        bot.chat('Collecting ' + args[1] + '!');

        const block = bot.findBlock({
            matching: targetBlock.id,
            maxDistance: 64
        });

        if (!block) return bot.chat('Block not in range!');

        bot.collectBlock.collect(block, err => {
            if (err) bot.chat(err.message);
        });
    });
}