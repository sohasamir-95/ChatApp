var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var users=[];
var connections=[];
//var usernames=[];
server.listen(process.env.PORT ||3000);
console.log('Server running...');
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html')
});
io.sockets.on('connection',function(socket){
connections.push(socket);
console.log('connected: %s sockets connected',connections.length);
//Disconnect

users.splice(users.indexOf(socket.username),1);
updateUsernames();
socket.on('disconnect',function(data){
connections.splice(connections.indexOf(socket),1)
console.log('Disconnected:%s sockets connected',connections.length)
});
//send Message
socket.on('send message',function(data){
console.log(data);
io.sockets.emit('new message',{msg: data,user:socket.username});
});
//new user
socket.on('new user',function(data,callback)
{
    callback(true);
    socket.username=data;
    console.log(socket.username);
    users.push(socket.username);
    updateUsernames();
});
function updateUsernames(){
io.sockets.emit('get users',users);
}
});