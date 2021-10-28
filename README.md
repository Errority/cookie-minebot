# cookie-minebot

Cookie MineBot is a Minecraft bot written in JavaScript using the mineflayer package. It comes with a high level API wrapper for the mineflayer bot class to make coding much easier.

## Bot
This is the documentation for the `Bot` class. It is a wrapper around the mineflayer bot instance to make coding minecraft bots easier.  

Additional information such as return values can be found by hovering over typed-out methods in VSCode or by looking it up in the `lib\Bot.js` file.

### Properties

#### `bot.bot`
This is the original mineflayer bot instance.

#### `bot.mcdata`
This is data from the `minecraft-data` package for the 1.17.1 version.

### Methods

#### `bot.chat(msg, [amount=1], [delay=0])`
This makes the bot send a message and send it multiple times with a delay if specified.  
- `msg` is a string representing the message to send.  
- `amount` is a number representing the amount of times the message should be sent.  
- `delay` is a number representing the time to wait between sending the messages in ms.

#### `bot.dropItem(item, [count=1])`
This makes the bot drop an item or multiple if specified.
- `item` is a string or a number representing the name or the ID of the item to drop.
- `count` is a number representing the amount of items to drop.

#### `bot.goTo(x, y, z)`
This makes the bot go to the given coordinates.  
- `x`, `y`, `z` are numbers representing the coordinates of the block to go to.

#### `bot.followPlayer(player, [range=3])`
This makes the bot follow a player if they are in sight.  
- `player` is a string of the players name you want to follow.  
- `range` is the distance the bot will hold to the player.

#### `bot.followNearestEntity(type, [range=3])`
This makes the bot follow the nearest entity of the type `type`.  
- `type` is a string representing an entity type e.g. 'cow', 'player'.  
- `range` is the disctance the bot will hold to the entity.

#### `bot.stopPathfinding()`
This makes the bot stop pathfinding to the current goal.  
This will cancel actions like `bot.followPlayer()` or `bot.goTo()`.

## Utils

### Functions

#### `sleep(ms)`
This makes the process stop for a given time.  
- `ms` is a number representing the amount of time to wait in ms.
