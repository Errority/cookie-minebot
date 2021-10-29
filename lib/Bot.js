const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;const { EventEmitter } = require('events');
const attackSpeeds = require('./attackSpeeds.json');
const dps = require('./dps.json');
const { GoalBlock, GoalFollow } = require('mineflayer-pathfinder').goals;
const { login } = require('../config');
const { sleep } = require('./util');

class Bot extends EventEmitter {
    /**
     * **Create a Minecraft Bot**  
     * Source code and documentation: https://github.com/Errority/cookie-minebot/
     */
    constructor() {
        super();

        this.mcdata = null;

        this.bot = mineflayer.createBot(login);
        this.bot.loadPlugin(pathfinder);
        this.bot.once('spawn', () => {
            this.mcdata = require('minecraft-data')(this.bot.version);
            this.bot.pathfinder.setMovements(new Movements(this.bot, this.mcdata));
            this.emit('ready');
        });
        this.bot.on('death', () => { this.stopPathfinding(true); });
    };

    /**
     * Make the bot send a message to the chat.
     * @param {String} msg - The **content** of the message.
     * @param {Number} amount - The **amount** of messages to send with the given **content**.
     * @param {Number} delay - The **time** in ms to **wait** between messages.
     * @returns {Promise<void>} Promise which resolves when all messages have been sent.
     */
    async chat(msg, amount = 1, delay = 0) {
        for (let i = 0; i < amount; i++) {
            this.bot.chat(msg);
            await sleep(delay);
        }
    };

    /**
     * Make the bot drop items from the inventory.
     * @param {String | Number} itemID - The **item ID** or **name** of the item to drop.
     * @param {Number} [count] - The **amount** of **items** to drop. Default is **1** item.
     * @returns Promise which resolves when all items have been dropped.
     */
    async dropItem(item, count = 1) {
        if (typeof item === 'string') {
            return await this.bot.toss(this.mcdata.itemsByName[item].id, count)
                .catch(err => { throw err });
        } else if (typeof item === 'number') {
            return await this.bot.toss(item, count)
                .catch(err => { throw err });
        }
    };

    /**
     * Make the bot go to specific coordinates.
     * @param {Number} x - **X** coordinate of the goal.
     * @param {Number} y - **Y** coordinate of the goal.
     * @param {Number} z - **Z** coordinate of the goal.
     * @returns Promise which resolves when the goal is reached.
     */
    async goTo(x, y, z) {
        return await this.bot.pathfinder.goto(new GoalBlock(x, y, z))
            .catch(err => { throw err; });
    };

    /**
     * Make the bot follow a player.
     * @param {String} player - Name of the **player** to follow.
     * @param {Number} [range=3] - The **distance** the bot will hold to the **player**. Default is **3** blocks.
     * @returns Nothing.
     */
    followPlayer(player, range = 3) {
        const target = this.bot.players[player] ? this.bot.players[player].entity : null;
        if (!target) throw new Error(`Player ${player} is not in range`);

        return this.bot.pathfinder.setGoal(new GoalFollow(target, range), true);
    };

    /**
     * Make the bot follow the nearest entity.
     * @param {String} type - **Type** of the **entity** to follow e.g. **'cow'** or **'player'**.
     * @param {Number} [range] - The **distance** the bot will hold to the **entity**.
     * @returns Nothing.
     */
    followNearestEntity(type, range = 3) {
        const target = this.bot.nearestEntity(e => e.name.toLowerCase() == type);
        if (!target) throw new Error(`Entity ${type} is not in range`);

        return this.bot.pathfinder.setGoal(new GoalFollow(target, range), true);
    };

    /**
     * Make the bot follow and kill an entity.
     * @param {Entity} entity - The entity to **kill**.
     * @returns {Promise} - Promise which resolves when the entity is killed.
     */
    async kill(entity) {
        const target = this.bot.entities[entity.id] ? this.bot.entities[entity.id] : null;
        if (!target) throw new Error(`Entity ${type} is not in range`);

        this.bot.pathfinder.setGoal(new GoalFollow(target, 2), true);

        let bestWeapon = 'other';
        for (const weapon of this.bot.inventory.items()) {
            if (dps[weapon.name] > dps[bestWeapon]) bestWeapon = weapon.name;
        }
        if (bestWeapon == 'other') await this.bot.unequip('hand')
            .catch(err => { console.log('Failed to equip hand. Reason:\n' + err); });
        else await this.bot.equip(this.mcdata.itemsByName[bestWeapon].id)
            .catch(err => { console.log('Failed to equip ' + bestWeapon + '! Reason:\n' + err); });

        let ticksLeft = 0;
        const attack = () => {
            if (ticksLeft > 0) return ticksLeft--;
            if (this.bot.entity.position.distanceTo(target.position) <= 3.5) {
                if (ticksLeft <= 0) {
                    ticksLeft = 1 / attackSpeeds[bestWeapon] * 20;
                    return this.bot.attack(target);
                }
            }
        };
        this.bot.on('physicsTick', attack);

        let resolver;
        const entityDead = (entity) => {
            if (entity == target || entity == this.bot.entity) {
                if (entity != this.bot.entity) delete this.bot.entities[entity.id];
                clearEventHandlers();
                resolver();
            }
        };

        const clearEventHandlers = () => {
            this.bot.off('entityDead', entityDead);
            this.bot.off('physicsTick', attack);
        }

        return new Promise(resolve => {
            resolver = resolve;
            this.bot.on('entityDead', entityDead);
        });
    };

    /**
     * Make the bot stop moving.
     * @param {Boolean} [force=false] - Force stop will stop **immediately** instead of stopping in a safe spot.
     * @returns Nothing.
     */
    stopPathfinding(force = false) {
        return force ? this.bot.pathfinder.setGoal(null) : this.bot.pathfinder.stop();
    };
};

module.exports = Bot;