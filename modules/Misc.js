const Uwuifier = require("uwuifier");
const uwuifier = new Uwuifier();

const uwu = (message) => {

  // Remove !uwu from the string
  const sentenceToConvert = message.content.substring(5);

  message.channel.send({
    content: uwuifier.uwuifySentence(sentenceToConvert),
    reply: { messageReference: message.id },
  });
};

module.exports = {
  uwu,
};
