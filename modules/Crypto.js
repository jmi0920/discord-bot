const axios = require("axios");
const Discord = require("discord.js");

const getPrice = (message, tokenName) => {
  axios
    .get(`https://api.coingecko.com/api/v3/coins/${tokenName}`)
    .then((res) => {
      const embed = new Discord.MessageEmbed()
        .setTitle(res.data.name)
        .setColor("#5b87cf")
        .setDescription(
          "Current Price: **$" +
            res.data.market_data.current_price.usd +
            "**" +
            "\nLow 24H: $" +
            res.data.market_data.low_24h.usd.toFixed(2) +
            "\nHigh 24H: $" +
            res.data.market_data.high_24h.usd.toFixed(2)
        )
        .setThumbnail(res.data.image.small);

      message.channel.send({ embeds: [embed] });
    })
    .catch(() => {
      message.channel.send("Coin not found");
    });
};

const listNewTokens = (message) => {
  axios
    .get(`https://api.ethplorer.io/getTokensNew?apiKey=freekey`)
    .then((res) => {
      const top10 = res.data.slice(0, 9);
      const embed = new Discord.MessageEmbed()
        .setTitle("10 Newest Tokens")
        .setDescription(
          top10
            .map((tokenObject) => {
              return (
                tokenObject.symbol +
                ": $" +
                tokenObject.price.rate +
                "\n" +
                "Holders: " +
                tokenObject.holdersCount +
                "\n" +
                "Address: " +
                tokenObject.address +
                "\n"
              );
            })
            .join("\n")
        );
      message.channel.send({ embeds: [embed] });
    });
};

module.exports = {
  getPrice,
  listNewTokens,
};
