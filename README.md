# MathBot

A Node.js irc bot that acts as a Javascript REPL.
```
heated: Math.pow(2, 3);
MathBot: 8
```

You can tell MathBot to respond to specific regexes. 
```
heated: MathBot.respondTo(/:D$/i, 'lol');
MathBot: created!
heated: lol :D
MathBot: lol
```

MathBot helpfully ignores simple strings and statements.
```
heated: "Well, I guess not. Maybe the hokey pokey is what it's all about?"
heated: huh
heated: true
heated: you guys want to grab lunch?
```

MathBot comes packaged with Lo-Dash, which is like Underscore.js but faster.
```
heated: _.any([false, '', 0, undefined, null]);
MathBot: !!false
```
