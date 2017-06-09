//server.js
var express = require('express'),
    app = express(),
    path = require('path'),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    googleStocks = require('google-stocks'),
    fs = require('fs'),
    compression = require('compression');
var routes = require('./router');
var feed  = require('./feed');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(compression()); //deal with boundle.gzip
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname, './public')));

var conTable = new Object;

app.post('/getHisData', routes.getHistoryStock);
app.get('*.js', routes.responsegz);

io.on('connection' , function(socket) {
    console.log("一位使用者已連接. Socket id = &s" , socket.id);

    socket.on('join' , function(rooms){
     
        if(conTable[socket.id] === undefined){
           conTable[socket.id] = rooms;
        }else{
            rooms.forEach(function(room){
              conTable[socket.id].push(room);
            });
        }

        feed.init(function(room, type, message){
            io.to(room).emit(type, message);
        }, socket.id, conTable[socket.id] );

    });

    socket.on('leave' , function(rooms){
        console.log('Socket %s unSubScribed from %s', socket.id, rooms);

        if(conTable[socket.id] !== undefined){
           delete conTable[socket.id];
        }

        feed.delSymbol(socket.id, rooms);
    });

    socket.on('disconnect', function(){
        console.log('一位使用者離開了 %s Socket id %s', socket.id);
        if(conTable[socket.id] !== undefined){
            delete conTable[socket.id];
        }
         feed.delSymbol(socket.id, "delAll");
        console.log(conTable);
    });
}); 

feed.start(function(room, type, message){
   io.to(room).emit(type, message);
});

 
http.listen(80, function(){
    console.log('React Trader listening on : 80');
});
