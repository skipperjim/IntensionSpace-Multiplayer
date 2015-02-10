var socket = io('http://localhost:3700');
//var socket = io('http://localhost:3700', {transports: ['websocket', 'polling', 'flashsocket']});
socket.on('connect', function(){
     console.log('socket connected.');
});
socket.on('news', function (data) {
    console.log("Player connected: "+data);
    socket.emit('my other event', {
        my: 'data'
    });
});