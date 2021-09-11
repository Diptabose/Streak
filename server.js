const express=require('express');
const socketIO=require('socket.io');
const fs=require('fs');
const PORT=process.env.PORT||3000;
const path=require('path');                   
const INDEX='/IntroLogo.html';
const app=express().use(express.static(path.join(__dirname,'public'))).get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','IntroLogo.html'));
}).listen(PORT,()=>console.log('listen'));
global.io=socketIO(app);
var users={};

var typers=[];

var activeUsers=[];

var currentname=[];

io.on('connection',socket=>{

  socket.on('new-user-joined',name=>{

    console.log('User',name);

    users[socket.id]=name;

    console.log(users);

    currentname.length=0;

    activeUsers.push(name);

    currentname.push(name);

    console.log(activeUsers);

    socket.broadcast.emit('user-joined',name);

    socket.broadcast.emit("online",currentname);

    socket.emit("ionline",activeUsers);

  });

    socket.on('keyisdown',typename=>{

    if(typers.includes(typename))

{

     //console.log("User already present");

}

     else{

     typers.push(typename);

      //  console.log(typers);

      socket.broadcast.emit("returntypers",typers);

      }

  });

    socket.on("checkuser",(name)=>{

    if(typers.includes(name));

    {

      var a=true;

      socket.broadcast.emit("returnuserpresent",a);

    }

});

    socket.on("removetyper",rtyper=>{

    if(typers.includes(rtyper))

    {

       typers.pop(rtyper);

   }

     socket.broadcast.emit("removefromothers");

   });

  socket.on('send',message=>{

    socket.broadcast.emit('recieve',{message:message,name:users[socket.id]});

  });

 /* socket.on('image',imgpath=>{

    console.log('image recieved');

    var buffer = Buffer.from(imgpath, 'base64');

   fs.writeFile('/tmp/image', buffer,()=>{

     socket.broadcast.emit('recieveimg',{path:imgpath.toString('base64'),name:users[socket.id]});

       console.log("buffer sent");

   });*/

    // fs.promises

  socket.on('disconnect',message=>{

    socket.broadcast.emit('left',users[socket.id]);

    delete users[socket.id];

    activeUsers.pop(users[socket.id])

    currentname.length=0;

    check_null(users);

 });

});

//console.log(__dirname);

  function check_null(users){

  Object.entries(users).forEach(([k,v])=>{

    if(v===null)

    {

      delete users[k];

    }

  });

}

