require("dotenv").config();
const Discord = require("discord.js");
const BannedWordListener = require("./modules/BannedWordListener");
const Crypto = require("./modules/Crypto");
const Misc = require("./modules/Misc");

const client = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.warn("Bot Connected");

  client.user.setUsername("0 Tox Bot");
  client.user.setActivity("Listening for the word");
});

client.on("messageCreate", async (message) => {
  const content = message.content;

  BannedWordListener.listener(message);

  if (content.substring(0, 1) == "!") {
    var args = content.substring(1).split(" ");
    var cmd = args[0];

    switch (cmd) {
      case "price": {
        Crypto.getPrice(message, args[1]);
        break;
      }
      case "new": {
        Crypto.listNewTokens(message);
        break;
      }
      case "uwu": {
        Misc.uwu(message);
        break;
      }
    }
  }
});

client.login(process.env.TOKEN);
