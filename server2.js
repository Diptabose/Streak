const io=require('socket.io')(8000,{
  cors:{origin:'*'
  }
});


io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() =>{
  
  let h= new Date().getHours();
  let m=new Date().getHours();
  let s=new Date().getSeconds();
  io.emit('time', {hour:h,min:m,sec:s});
 } , 1000);
