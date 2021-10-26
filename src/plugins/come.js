const mineflayer = require('mineflayer');
const { owner } = require('../../config');
const { GoalNear } = require('mineflayer-pathfinder').goals;

/**
 * @param {mineflayer.Bot} bot 
 */
module.exports = bot => {
    let mcdata;

    bot.once('spawn', () => {
        mcdata = require('minecraft-data')(bot.version);
    });

    bot.on('chat', (name, msg) => {
        if (name != owner || name == bot.username || msg != 'come') return;
        const t = bot.findBlock({
            matching: mcdata.blocksByName['oak_log'].id,
            maxDistance: 20
        }).position;
        const target = bot.players[name] ? bot.players[name].entity : null;
        if (!target) return bot.chat('Can´t see you!');
        const p = target.position;

        bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));
    });
};