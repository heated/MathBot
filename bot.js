var _ = require('lodash'),
	irc = require('irc'),
	express = require('express'),
	app = express(),

	config = {
		channels: ['#bestcohort'],
		server: 'irc.foonetic.net',
		botName: 'MathBot'
	};

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});


function Bot() {
	this.bot = new irc.Client(config.server, config.botName, {
		channels: config.channels
	});

	helpText =
	'I execute arbitrary Javascript expressions. For example, "Math.pow(2, 3)"\
	You can also tell me to respond to specific regexes. For example, "MathBot.respondTo(/^:D$/i, \'lol\')"\
	You can view my source at https://github.com/heated/MathBot/blob/master/bot.js';

	this.bot.addListener('message', this.respond.bind(this));
	this.respondTo(/^mathbot( help)?$/i, helpText);
	this.respondTo(/^man mathbot$/i, helpText);
	this.respondTo(/^kill mathbot$/i, function () { eval('exit'); });
	this.respondTo(/what is love/i, "baby, don't hurt me");
	this.respondTo(/^<3$/i, '<3');
	this.respondTo(/^:D$/i, 'lol');
}

Bot.prototype = {
	responses: [],

	respond: function (from, to, text, message) {
		if (from.match(/bot/i)) return;

		var match = _.find(this.responses, function (pair) {
			return text.match(pair.regex);
		});

		if (match) {
			var response = match.response;
			this.bot.say(to, (typeof(response) === "string") ? response : response(text) );
		}

		try {
			var result = eval(text);
			this.bot.say(to, (typeof(result) === "boolean" ? '!!' : '') + JSON.stringify(result));
		} catch(e) {}
	},

	respondTo: function (regex, response) {
		var match = _.find(this.responses, function (pair) {
			return pair.regex.toString() === regex.toString();
		});

		if (match) {
			match.response = response;
		} else {
			this.responses.push({ regex: regex, response: response });	
		}

		return "created!";
	}
}

MathBot = new Bot();
