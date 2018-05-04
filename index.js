'use strict';

const EventEmitter = require('events');
const ws = require('ws');
const crypto = require('crypto');

class HixieClient extends EventEmitter {
    constructor(request, socket, head) {
	this._socket = socket;
	this._parent = parent;
	socket.setTimeout(0);
	socket.setNoDelay(true);
	const NONCE_LENGTH = 8;
	const key1 = req.headers['sec-websocket-key1'];
	const key2 = req.headers['sec-websocket-key2'];
	const nonce = head.slice(0, NONCE_LENGTH);
	const processKey = function(key) {
	    const n = parseInt(key.replace(/[^\d]/g, ''));
	    const spaces = key.replace(/[^ ]/g, '').length;
	    if (spaces === 0 || n % spaces !== 0){
		console.log("ERROR: Hixie Protocol, incorrect key [" + key + "]");
		return;
	    }
	    return n / spaces;
	}
	var answer = new Buffer(4 * 2 + NONCE_LENGTH);
	answer.writeInt32BE(processKey(key1), 0);
	answer.writeInt32BE(processKey(key2), 4);
	nonce.copy(answer, 8);
	var headers = [
	    'HTTP/1.1 101 WebSocket Protocol Handshake',
	    'Upgrade: WebSocket',
            'Connection: Upgrade',
	    'Sec-WebSocket-Origin: ' + req.headers['origin'],
	    'Sec-WebSocket-Location: ws://' + req.headers.host + req.url,
	    '',''
	];
	var headerBuffer = new Buffer(headers.join('\r\n'));
	var hashBuffer = new Buffer(
	    crypto.createHash('md5').update(answer).digest('binary'), 'binary');
	var handshakeBuffer = new Buffer(headerBuffer.length + hashBuffer.length);
	headerBuffer.copy(handshakeBuffer, 0);
	hashBuffer.copy(handshakeBuffer, headerBuffer.length);
	this._socket.on('error', err => {
	    try { this._socket.destroy(); } catch(e) {}
	}).on('close', () => {
	    this.emit('close', this);
	}).write(handshakeBuffer, 'binary', function(err) {
	    if (!err) {
		this.emit('connection', this);
	    } else {
		this.emit('error', err, this);
	    }
	});
    };
    send(message) {
	if (this._socket) {
	    try {
		const outBuffer = new Buffer(message.length + 2);
		outBuffer.writeUInt8(0, 0);
		message.copy(outBuffer, 1);
		outBuffer.writeUInt8(255, outBuffer.length - 1);
		this._socket.write(outBuffer, 'binary', err => {
		    if (err)
			this.emit('error', err, this);
		});
	    } catch(err) {
		this.emit('error', err, this);
	    }
	}
    };
}

class WsPlusHixie extends EventEmitter {
    constructor(httpServer, options) {
	if (!options)
	    options = {};
	options.noServer = true;
	this._httpServer = httpServer;
	this._hixieClients = [];
	this._ws = new ws.WebSocketServer(options);
	httpServer.on('upgrade', (request, socket, head) => {
	    if (request && request.headers && request.headers['sec-websocket-key1']) {
		new HixieClient(request, socket, head);
		HixieClient.on('connection',client => {
		    this._hixieClients.push(client);
		    console.log("Connected [" + this._hixieClients.length + "]");
		}).on('error', (err, client) => {
		    console.log("Error: " + err);
		}).on('close', client => {
		    this._hixieClients = this._hixieClients.filter( e => e !== client );
		    console.log("Disconnected [" + this._hixieClients.length + "]");
		});
	    } else {
		this._ws.handleUpgrade(request, socket, head);
	    }
	});
    }
    send(message) {
	this._hixieClients.forEach(c => {
	    c.send(message);
	});
	this._ws.clients.forEach(c => {
	    c.send(message);
	});
    }
}

module.exports.WsPlusHixie = WsPlusHixie;
