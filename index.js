var app = require('express')();
var http = require('http').Server(app);
const fs = require('fs')
const path = require('path')
const io = require('socket.io')(http)

const indexHTML = (() => {
    return fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
  })()

const botHTML = (() => {
    return fs.readFileSync(path.resolve(__dirname, './bot.html'), 'utf-8')
  })()

app.get('/', function(req, res){
	res.send(indexHTML)
});

app.get('/bot', function(req, res){
	res.send(botHTML)
});

app.get('/say', function(req, res){
	io.emit('listen', req.query.v)
	res.end()
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {
	console.log('connected')
	socket.on('disconnect', () => {
		console.log('disconnected')
	})
	// socket.on('here', (data) => {
	// 	console.log(data)
	// 	socket.broadcast.emit('DDDD', (data))
	// 	// io.emit('DDDD', (data))
	// })
	socket.on('publish', (data) => {
		console.log(data)
		socket.broadcast.emit('listen', (data))
		// io.emit('DDDD', (data))
	})
})