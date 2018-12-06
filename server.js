var app = require('express')()
var http = require('http').Server(app)
const fs = require('fs')
const path = require('path')
const io = require('socket.io')(http)
const cleverbot = require("cleverbot.io")
bot = new cleverbot("XGtoopiQvJ1XEGiM", "yU9dy1YLtWTtCJOMs3BZyQDq6aoAGgyM");
bot.setNick("Nubo")
bot.create(function (err, Nubo) {
});
const port = process.env.PORT || 3000
const indexHTML = (() => {
    return fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
  })()

const botHTML = (() => {
    return fs.readFileSync(path.resolve(__dirname, './bot.html'), 'utf-8')
	})()

const talkHTML = (() => {
    return fs.readFileSync(path.resolve(__dirname, './talk.html'), 'utf-8')
  })()	

app.get('/', function(req, res){
	res.send(indexHTML)
});

app.get('/talk', function(req, res){
	res.send(talkHTML)
});

app.get('/bot', function(req, res){
	res.send(botHTML)
});

app.get('/answer', function(req, res){
	bot.ask(req.query.v, function (err, response) {
		res.send(response)
		console.log(req.query.v + ' ' + response);
	});
});

app.get('/say', function(req, res){
	io.emit('listen', req.query.v)
	res.end()
});

app.get('/pic', function(req, res){
	console.log(req.query.v)
	io.emit('pic', req.query.v)
	res.end()
});

http.listen(port, function(){
  console.log('listening on *:', port);
});

io.on('connection', (socket) => {
	socket.on('disconnect', () => {
		socket.broadcast.emit('stop')
	})
	socket.on('publish', (data) => {
		socket.broadcast.emit('listen', (data))
	})
	socket.on('spin', () => {
		socket.broadcast.emit('spin')
	})
})