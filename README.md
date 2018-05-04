# ws-plus-hixie

This is a small wrapper of the ws library, to add the outdated (and deprecated)
hixie protocol support.
Unfortunately, even though the hixie draft was dropped early on, some devices use it.
Of special interest, the Kindle (at least on mine, I can't update the Experimental Browser)


**Note**: most of the configuration is done at the ws class, the library is at:
[`ws`](https://www.npmjs.org/package/ws)
This wrapper is mostly intended for "sending" data to the connected devices.
(aka, basically is to keep the kindle updated, for an interesting use, check my
[`kindle-tty`](https://bitbucket.org/ocampos/noxquest_kindle-tty)

## Usage

npm install ws-plus-hixie

```js
const http = require('http');
const WsHixie = require('ws-plus-hixie');

const httpServer = http.createServer();
const ws = new WsHixie(httpServer); 

someEvent = function(message) {
   ws.send(message);
}		     
```
