var app = require('express')();
//var server = require('http').Server(app);
var server = require('http').Server(app).listen(3700, function() {
    console.log('Express server listening on port ' + 3700);
} );
var io = require('socket.io')(server);
var fs = require('fs');

//server.listen(3700);

/*
app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', "http://"+req.headers.host+':3700');

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    }
);
*/

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/build/index.html');
});

io.on('connection', function (socket) {
    socket.emit('news', {
        hello: 'world'
    });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});