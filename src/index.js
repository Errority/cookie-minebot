const fs = require('fs');
const path = require('path');
const { login } = require('../config');
const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const collect = require('mineflayer-collectblock').plugin;

/**
 * @param {mineflayer.Bot} bot 
 */
function loadPlugins(bot) {
    const dir = path.join(__dirname, 'plugins');
    const modules = fs
        .readdirSync(dir)
        .filter(f => f.endsWith('.js'))
        .map(name => require(path.join(dir, name)));

    bot.loadPlugins(modules);
    bot.loadPlugin(pathfinder);
    bot.loadPlugin(collect);
};

function init() {
    const bot = mineflayer.createBot(login);
    loadPlugins(bot);
};

init();