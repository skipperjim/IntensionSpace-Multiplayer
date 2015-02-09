var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.get('/', function (req, res) {
    //es.sendfile(__dirname + '/index.html');
    res.send('hello!');
});

io.sockets.on('connection', function (socket) {
    console.log("User connected");
});

exports = module.exports = server;
// delegates use() function 
exports.use = function () {
    app.use.apply(app, arguments);
};