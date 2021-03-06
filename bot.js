var _ = require('lodash'),
	irc = require('irc'),

	config = {
		channels: [process.env.IRC_CHANNEL],
		server: process.env.IRC_SERVER,
		botName: 'MathBot'
	};

function Bot() {
	this.bot = new irc.Client(config.server, config.botName, {
		channels: config.channels
	});

	var helpText = 'I am a Javascript REPL bot! You can view my source at https://github.com/heated/MathBot';

	this.bot.addListener('message', this.respond.bind(this));
	this.respondTo(/^mathbot( help)?$/i, helpText);
	this.respondTo(/^man mathbot$/i, helpText);
	this.respondTo(/^(kill|die|go away) mathbot$/i, this.die);
	this.respondTo(/^mathbot (kill|die|go away)$/i, this.die);
	this.respondTo(/what is love/i, "baby, don't hurt me");
	this.respondTo(/^<3$/i, '<3');
	this.respondTo(/:D$/i, 'lol');
	this.respondTo(/^mathbot say (.+)$/i, function (text) { return text.match(/^mathbot say (.+)$/i)[1]; });
}

Bot.prototype = {
	responses: [],

	say: function (str) {
	  this.bot.say(config.channels[0], str);
	},

	respond: function (from, to, text, message) {
		if (from.match(/bot/i)) {
			return;
		}

		var match = _.find(this.responses, function (pair) {
			return text.match(pair.regex);
		});

		if (match) {
			var response = match.response;
			this.say( (typeof(response) === "string") ? response : response(text) );
		}

		try {
			this.readEvalPrint(text);
		} catch(e) {}
	},

	readEvalPrint: function (text) {
		var result = eval(text);
		var output = JSON.stringify(result);
		// no replying to quotes, numbers, simple stuff, etc.
		if (text !== output && !text.match(/^'[^']*'$/)) {
			this.say( (typeof(result) === 'boolean' ? '!!' : '') + output );
		}
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

		return 'created!';
	},

	die: function () {
		eval('exit');
	}
}

MathBot = new Bot();
