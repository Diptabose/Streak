const express=require('express');
const socketIO=require('socket.io')
const PORT=process.env.PORT||3000;
const path=require('path');                   
const INDEX='/Chat.html';
const app=express().use(express.static(path.join(__dirname,'public'))).get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','Chat.html'));
}).listen(PORT,()=>console.log('listen'));
const io=socketIO(app);
const users={};
io.on('connection',socket=>{
  socket.on('new-user-joined',name=>{
    console.log('User',name);     
    users[socket.id]=name;
    socket.broadcast.emit('user-joined',name);
  });

  socket.on('send',message=>{
    socket.broadcast.emit('recieve',{message:message,name:users[socket.id]});
  });

  socket.on('disconnect',message=>{
    socket.broadcast.emit('left',users[socket.id]);
    delete users[socket.id];
  });

});
console.log(__dirname);
