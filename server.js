
const express=require('express');
const socketIO=require('socket.io')
const PORT=process.env.PORT||3000;
const INDEX='/Chat.html';
const server=express();
server.use(express.static("public"));
server.use((req,res)=>{
  res.sendFile(INDEX,{root:public})
  });
server.listen(PORT,()=>{
  console.log('listening on some port')}
        );
const io=socketIO(server);
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
