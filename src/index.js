const Bot = require('../lib/Bot');

const bot = new Bot();

bot.on('ready', async () => {
    for (let i = 0; i < 10; i++) {
        await bot.kill(bot.bot.nearestEntity(e => e.name == 'player')).then(() => console.log('done'));
    }
});