//server.js
var express = require('express'),
    app = express(),
    path = require('path'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    googleStocks = require('google-stocks'),
    fs = require('fs');
var routes = require('./router');
var feed  = require('./feed');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, './public')));

app.post('/getHisData', routes.getHistoryStock)
app.post('/addSymbols', function(req, res){
    let arr = (req.body.addSymbols).split(',');
    feed.addSymbols(arr);
    res.end();
})

app.post('/delSymbol', function(req, res){
    feed.delSymbol(req.body.delSymbol);
    res.end();
})



io.on('connection' , function(socket) {
    console.log("一位使用者已連接. Socket id = &s" , socket.id);

    socket.on('join' , function(rooms){
        if (Array.isArray(rooms)) {
            rooms.forEach(function(room){
                socket.join(room);
            });
        } else {
            socket.join(rooms);
        }
        //加入完成後順便取一次資料當作初始化
        feed.init(function(room, type, message){
            io.to(room).emit(type, message);
        }, rooms);
    });

    socket.on('leave' , function(rooms){
        console.log('Socket %s unSubScribed from %s', socket.id, rooms);
        if (Array.isArray(rooms)) {
            rooms.forEach(function(room){
                socket.leave(room);
            });
        } else {
            socket.leave(rooms);
        }
    });

    socket.on('disconnect', function(){
        console.log('User disconnected %s Socket id %s', socket.id);
    });
}); 

feed.start(function(room, type, message){
   io.to(room).emit(type, message);
});
 
http.listen(80, function(){
    console.log('React Trader listening on : 80');
});
