const login = {
    "host": "Server IP / localhost",
    "port": "Server Port", // This line is optional. If you are using a server with standard port you can delete this line.
    "username": "Your minecraft username", // If you are playing on an offline mode server you can set this to whatever you want, else you need to use your email/username.
    "password": "Your minecraft password" // This line is optional. If you are using an offline mode server you can delete this line.
}

const owner = "Your minecraft username"; // This required for the bot to know who is owning it.

module.exports = { login, owner };