var irc = require("irc");

var config = {
  channels: ["#appacademy"],
  server: "irc.foonetic.net",
  botName: "MathBot"
};

function Bot() {
  this.bot = new irc.Client(config.server, config.botName, {
    channels: config.channels
  });

  this.bot.addListener("message", this.respond.bind(this));
}

Bot.prototype.respond = function(from, to, text, message) {
  if(from.match(/Bot/)) return;

  if(text.match(/^MathBot/))
    this.bot.say(to, 'This bot executes arbitrary Javascript expressions. For example, "Math.pow(2, 3)"');

  else if(text.match(/^kill MathBot$/)) {
    eval("exit");

  } else if(executable(text)) {
    try {
      this.bot.say(to, JSON.stringify(eval(text)));
    } catch(e) {

    }
  }
}

invalidStrings = [
  /eval/,
  /while/,
  /for/,
  /function/,
  /return/,
  /Bot/,
  /var/,
  /executable/,
  /irc/,
  /config/,
  /scores/,
  /this/,
  /setInterval/,
  /setTimeout/,
  /\=/
];

function executable(str) {
  for(var i = 0; i < invalidStrings.length; i++) {
    if(str.match(invalidStrings[i])) {
      return false;
    }
  }
  return true;
}

// new Bot();

// function checkParens(str) {
//   var stack = 0;
//   for(var i = 0; i < str.length; i++) {
//     if(str[i] == "(") {
//       stack++;
//     } else if(str[i] == ")") {
//       if(--stack < 0) return false;
//     }
//   }
//   return stack == 0;
// }

// /^\(*\d+\)*( *[\+\-\*\/] *\(*\d+\)*)+$/

// What is required?
// quote, atom, eq, cons, car, cdr, cond, define

var namespace = {};

function car(exp) {
  return exp[0];
}

function cdr(exp) {
  return exp[1];
}

function cons(exp1, exp2) {
  return [exp1, exp2];
}

function eq(exp1, exp2) {
  if(atom(exp1) || atom(exp2)) {
    return exp1 === exp2;
  } else {
    return eq(car(exp1), car(exp2)) && 
           eq(cdr(exp1), cdr(exp2));
  }
}

function define(name, exp) {
  namespace[name] = exp;
}

function atom(exp) {
  return !(exp instanceof Array);
}

function quote(exp) {
  return exp;
}

function tokenize(str) {
  return str
    .replace(/\(/g, " ( ")
    .replace(/\)/g, " ) ")
    .trim()
    .replace(/ +/g, " ")
    .split(" ");
}

function stringify(exp) {
  if(!exp) return "";

  if(exp.length == 0) return "()";

  var left = "";
  if(atom(car(exp)))
    left = car(exp);
  else
    left = "(" + stringify(car(exp)) + ")";
  
  var right = stringify(cdr(exp));
  if(right) right = " " + right;
  return left + right;
}

function nest(tokens) {
  var stack = [];
  var current = [];
  var last = [];

  for(var i = 0; i < tokens.length; i++) {
    var el = tokens[i];
    switch(el) {
    case "(":
      var newNode = [];
      current[0] = newNode;
      stack.push(current);
      current = newNode;
      break;
    case ")":
      if(stack.length == 0) return false;
      last[1] = null;
      current = stack.pop();
      var newNode = [];
      current[1] = newNode;
      last = current;
      current = newNode;
      break;
    default:
      var num = parseFloat(el);
      current[0] = num ? num : el;

      var newNode = [];
      current[1] = newNode;
      last = current;
      current = newNode;
      break;
    }

  }
  last[1] = null;
  if(stack.length != 0) return false;
  return last;
}

function parse(str) {
  return nest(tokenize(str));
}

console.log(nothing("(1 2 3 4 5)"));
console.log(eq(parse("(1 2 3 4 5)"), parse("(1 2 3 4 5)")));

function nothing(str) {
  return stringify(parse(str));
}

function cond(exp) {

}
