const Discord = require("discord.js");
const { indexOf } = require("lodash");
const axios = require('axios');
const querystring = require('querystring')
const ACTIVE_CHANNELS = ["796773627634253824", "805857643784306728"];
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

let timeoutInSeconds = 10;

const BANNED_WORDS = [
  "list",
  "iist",
  "1ist",
  "l1st",
  "tsil",
  "listing",
  "listed",
  "|ist",
];

const punctuation = ["~", "*", "!", "`", "\\", "/", "|", "_", ":"];

const foundBannedWord = (message, incomingString) => {
  const words = incomingString.split(" ");
  let shouldTimeout = false;

  words.forEach((word) => {
    var wordL = word.toLowerCase();
    var wordS = wordL.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    if (BANNED_WORDS.includes(wordL)) {
      shouldTimeout = true;
    }
    if (BANNED_WORDS.includes(wordS)) {
      shouldTimeout = true;
    }

    if (shouldTimeout == false && BANNED_WORDS.some(v => wordL.includes(v))){
      const data = "text="+wordL+"&language=en-US";

      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      var queryResponse = "";
      
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
          var responseJSON = JSON.parse(this.responseText);
          console.log(responseJSON);
          if (responseJSON.matches.length > 0){
            if (responseJSON.matches[0].rule.id == 'MORFOLOGIK_RULE_EN_US'){
              shouldTimeout = true;
              if (message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send(`Sorry, ${message.author.username} is too powerful to mute ¯\\_(ツ)_/¯`);
              } else {
                try {
                  message.member.timeout(
                    timeoutInSeconds * 1000,
                    "Said the one banned word"
                  );
                  console.log(`Timing out ${message.author.username}`);
                  const embed = new Discord.MessageEmbed()
                    .setTitle("User Timed Out")
                    .setColor("#5b87cf")
                    .setDescription(
                      message.author.username +
                        " was timed out for saying the one banned word."
                    );
                  message.channel.send({ embeds: [embed] });
                } catch (err) {
                  console.log(`COULD NOT TIMEOUT ${message.author.username}`);
                }
              }
            }
          }
        }
      });
      
      xhr.open("POST", "https://grammarbot.p.rapidapi.com/check");
      xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("x-rapidapi-host", "grammarbot.p.rapidapi.com");
      xhr.setRequestHeader("x-rapidapi-key", "8548220d32mshbaaa1e2fb84bba9p15a026jsn016bf149b18b");
      
      xhr.send(data);
    }
  });
  return shouldTimeout;
};

const listener = (message) => {
  if (
    ACTIVE_CHANNELS.includes(message.channelId) &&
    foundBannedWord(message.content)
  ) {
    if (
      message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)
    ) {
      message.channel.send(
        `Sorry, ${message.author.username} is too powerful to mute ¯\\_(ツ)_/¯`
      );
    } else {
      try {
        message.member.timeout(
          timeoutInSeconds * 1000,
          "Said a banned word"
        );
        console.log(`Timing out ${message.author.username}`);
        const embed = new Discord.MessageEmbed()
          .setTitle("User Timed Out")
          .setColor("#5b87cf")
          .setDescription(
            message.author.username +
              " was timed out for saying a banned word."
          );
        message.channel.send({ embeds: [embed] });
      } catch (err) {
        console.log(`COULD NOT TIMEOUT ${message.author.username}`);
      }
    }
  }
};
module.exports = {
  listener,
};
