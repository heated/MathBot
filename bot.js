// Create the configuration
var config = {
  channels: ["#appacademy"],
  server: "irc.foonetic.net",
  botName: "bot_master"
};

// Get the lib
var irc = require("irc");

// Create the bot name
var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

// // Listen for joins
// bot.addListener("join", function(channel, who) {
//   // Welcome them in!
//   bot.say(channel, who + "...dude...welcome back!");
// });

// Listen for any message, PM said user when he posts
// bot.addListener("message", function(from, to, text, message) {
//   // bot.say(from, "¿Que?");
//   var msg = message.args[1];
//   var answer = null;

//   if(msg.match("^What is ")) {
//     try {
//       answer = eval(msg.slice(8, -1));
//     }
//     catch(e) {
//       console.log("hi");
//       console.log(msg.slice(8, -1));
//     }
//     if(answer != null) {
//       bot.say(config.channels[0], answer);
//     } else {
//       bot.say(config.channels[0], "Best rephrase, son.");
//     }
//   } 
// });

bot.addListener("message", function(from, to, text, message) {

  if(from.match("^NedBot")) {
    bot.say(config.channels[0], "Good question, um, maybe Ned can answer that.");
  }
});

// "Good question, " + from + ", the answer is: " +

// Listen for any message, say to him/her in the room
// bot.addListener("message", function(from, to, text, message) {
//   bot.say(config.channels[0], "¿Public que?");
// });