var config = {
  channels: ["#appacademy"],
  server: "irc.foonetic.net",
  botName: "ed_bot"
};

var irc = require("irc");

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

var scores = {};

bot.addListener("message", function(from, to, text, message) {

  if(text.indexOf("lol ") == 0) {
    var person = text.slice(4);
    if(person == from) {
      say(to, "Laughing at yourself, " + from + "?");
    } else {
      inc(person);
    }

  } else if(text.indexOf("ed_bot: score?") == 0) {
    var person = text.slice(15);
    if(person.size == 0) person = from;
    check(person);
    say(to, scores[person]);

  } else if(text.indexOf("ed_bot: help") == 0)
    say(to, '"lol <name>" to upvote; "ed_bot: score? [name]" for info');

  else if(text.match("what is love"))
    say(to, "baby don't hurt me");

  else if(text.match("^ed_bot$"))
    say(to, "what?");

  else if(text.match("beautiful strong"))
    dec(from);

});

function check(name) {
  scores[name] = scores[name] || 0;
}

function inc(name) {
  check(name);
  scores[name] += 1;
}

function dec(name) {
  check(name);
  scores[name] -= 1;
}

function say(to, str) {
  bot.say(to, str);
}