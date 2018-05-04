# ws-plus-hixie

Wrapper of the ws library, adding support for the old and deprecated hixie protocol.
Unfortunately, even though the hixie draft was dropped early on, some devices use it.
Of special interest, the Kindle (at least on mine, I can't update the Experimental Browser)


**Note**: most of the configuration is done at the 
[`ws`](https://www.npmjs.org/package/ws) class
At it's current version (1.0.0), this wrapper is only intended for "sending" data
to the connected devices. It might be tweaked to add support for "receiving" data,
but it's not really on the TODO list, unless a use-case scenario pops up.

Currently I'm using it for my [`kindle-tty`](https://bitbucket.org/ocampos/noxquest_kindle-tty) 
project. Which basically just displays a copy of a tty on the kindle! (ahem, use the kindle as a
poor man's monitor)

## Usage

npm i ws-plus-hixie

```js
const http = require('http');
const WsHixie = require('ws-plus-hixie');

const httpServer = http.createServer();
const ws = new WsHixie(httpServer); 

const someEvent = function(message) {
   ws.send(message);
}		     
```
