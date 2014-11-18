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

	var helpText =
'I execute arbitrary Javascript expressions. For example, "Math.pow(2, 3)" \n\
You can also tell me to respond to specific regexes. For example, "MathBot.respondTo(/^:D$/i, \'lol\')" \n\
You can view my source at https://github.com/heated/MathBot/blob/master/bot.js';

	this.bot.addListener('message', this.respond.bind(this));
	this.respondTo(/^mathbot( help)?$/i, helpText);
	this.respondTo(/^man mathbot$/i, helpText);
	this.respondTo(/^(kill|die|go away) mathbot$/i, this.die);
	this.respondTo(/^mathbot (kill|die|go away)$/i, this.die);
	this.respondTo(/what is love/i, "baby, don't hurt me");
	this.respondTo(/^<3$/i, '<3');
	this.respondTo(/:D$/i, 'lol');
	this.respondTo(/^mathbot say (.+)$/i, function (text) { return text.match(/^mathbot say (.+)$/i)[1]; });
	this.respondTo(/^mathbot (shut (up|it)|cool (it|your jets)|calm (down|(your|thy)self)|(be )?quiet|(settle|tone it) down|st(op|ahp)|shh|chill)/i, this.toneItDown.bind(this));
	this.respondTo(/mathbot (wake up|bring (it|sexy) back|two hops|sup|yo|hey|what up)/i, this.bringItBack.bind(this));
}

Bot.prototype = {
	responses: [],

	say: function (str) {
	  this.bot.say(config.channels[0], str);
	},

	respond: function (from, to, text, message) {
		if (from.match(/bot/i)) return;

		var match = _.find(this.responses, function (pair) {
			return text.match(pair.regex);
		});

		if (match) {
			var response = match.response;
			this.say( (typeof(response) === "string") ? response : response(text) );
		}

		try {
			var result = eval(text);
			if (this.canSpeak()) {
				this.say( (typeof(result) === "boolean" ? '!!' : '') + JSON.stringify(result) );
			}
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
	},

	die: function () {
		eval('exit');
	},

	toneItDown: function () {
		this.chilling = setTimeout(this.bringItBack.bind(this), 300000);
		this.say(':(');
	},

	bringItBack: function () {
		clearTimeout(this.chilling);
		this.chilling = false;
		this.say(':)');
	},

	canSpeak: function () {
		return !this.chilling || !text.match(/^('|")[^"]*\1$/);
	}
}

MathBot = new Bot();
