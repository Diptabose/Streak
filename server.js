const express=require('express');
const socketIO=require('socket.io');
const fs=require('fs');
//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const PORT=process.env.PORT||3000;
const path=require('path'); 
const nodemailer = require('nodemailer');
const pg=require('pg');
//process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const INDEX='/IntroLogo.html';
const app=express().use(express.static(path.join(__dirname,'public'))).get('/',(req,res)=>{
 res.sendFile(path.join(__dirname,'public','IntroLogo.html'));
}).listen(PORT,()=>console.log('listening..'));

global.io=socketIO(app);

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'diptabose484@gmail.com',
    pass: 'immortal@ironman'
  }
});

const pool=new pg.Pool({
 connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized:false
  }
 });


var users={};
var typers=[];
var activeUsers=[];

io.on('connection',async(socket)=>{
 
const client = await pool.connect();
 var res= await client.query("select max(chatno) from messages");
 var ServerEnd= res.rows[0].max;
 console.log(res);
 await client.release();
 var offset=0;
  socket.on("FetchMsg",async(sendMsgJson)=>{
    const client= await pool.connect();
    try{
      const res= await client.query('select * from (select * from messages order by chatno desc limit $1) as foo offset $2 limit 50 ',[ServerEnd,offset]);
      console.log(res.rows);
      if(res.rows.length!=0){
      const JsonRes=await JSON.stringify(res);
      sendMsgJson(JsonRes);
      await client.release();
      offset=offset+50;
      }
     
    }catch(error)
    {
      console.error(error);
      await client.release();
    }
  });
  socket.on('new-user-joined',async(name,test)=>{
    console.log('User',name);  
    users[socket.id]=name;
    activeUsers.push(name);
   // socket.broadcast.emit('user-joined',name);
    socket.broadcast.emit("online",activeUsers);
    socket.emit("ionline",activeUsers);
    test(1);
  });

   socket.on('typers',(uname)=>{
    console.log(users[socket.id]);
   if(!typers.includes(uname)){
     setTimeout(function(){
  var index= typers.indexOf(users[socket.id]);
  typers.splice(index,1);
  socket.broadcast.emit('typerlist',typers);
     },3000);
    

     typers.push(uname);
     socket.broadcast.emit('typerslist',typers);
   }
   });
 
  socket.on('send',async(message)=>{
    socket.broadcast.emit('recieve',{message:message,name:users[socket.id]});
    
    const client= await pool.connect();
    try{
      const res= await client.query('insert into messages(sender,msg) values($1,$2)',[users[socket.id],message]);
      console.log("Msg inserted");
      await client.release();
    }
    catch(error)
    {
      console.error(error);
      await client.release();
    }
  });
  
 socket.on("SendOtp",async (name,mail,verifyuser)=>{
   let entry;
   console.log("Transfer shifted to server");
   const client = await pool.connect();
   console.log("Client connceted");
   try{
   const res= await client.query(`select username,email from login where username=$1 and email=$2`,[name,mail]);
     console.log(res.rowCount);
      if(res.rowCount>0)
      {
        console.log("User present already");
        verifyuser(0);
        await client.release();
      }
      else{
        const OTP= Otp();
        console.log(mail);
        console.log("OTP is "+ OTP);
        const mailOption=mailRecieverLoad(mail,OTP);
        mailSend(mailOption);
        verifyuser(OTP);
      
      }
   }catch(err){
     console.error(err);
     await client.release();
   }
    }
   );
   
   socket.on("ResendOTP",(mail,resendOtp)=>{
     console.log("Inside resend");
     var OTP= Otp();
     var mailOption=mailRecieverLoad(mail,OTP);
     var confirmMailSend= mailSend(mailOption);
     confirmMailSend.then((data)=>{
      console.log(data);
     if(data===0)
     {
       console.log("Error insending Otp");
       resendOtp(0);
     }
     else if(data===1)
     {
       console.log("Resending Otp");
       resendOtp(OTP);
     }
     });
   });
   
   socket.on("RegisterUser",async (name,mail,password,Streaks)=>{
     const client = await pool.connect();
     console.log("Inserting user in db");
     try{
     const res1= await client.query('insert into login(username,email,password)values($1,$2,$3)',[name,mail,password]);
       console.log(res1);
       Streaks(1);
        await client.release();
     }
     catch(err)
     {
       console.error(err);
       Streaks(0);
       await client.release();
     }
   
   });
   socket.on('LoginUser',async (mail, password,confirm)=>{
     console.log('Checking for login user');
      const client = await pool.connect();
     try{
       const res= await client.query('select * from login where email=$1',[mail]);
       console.log(res)
       
       if(res.rows[0].password==password)
       {
         const userJson= await JSON.stringify(res);
       confirm(userJson);
       }
       else{confirm(0);}
       await client.release();
     }
     catch(error)
     {
       confirm(-1);
       console.error(error);
       await client.release();
     }
   });
   
   socket.on("StkTimeUpt",async (name,utime,value,Updated)=>{
     const client = await pool.connect();
     if(value==0)
     {
       try{
         const res= await client.query('update login set streakscore=$1,updatedtime=$2 where username=$3',[value,"0",name]);
         console.log(res);
         await client.release();
         Updated(1);
       }
       catch(error)
       {
         Updated(0);
         console.error(error);
         await client.release();
       }
       
     }
     else if(value==1){
       try{
         const res = await client.query('update login set streakscore=streakscore+1 , updatedtime=$1 where username=$2' ,[utime,name]);
         console.log(res);
        await client.release();
        Updated(1);
       }
       catch(error){
         console.error(error);
          await client.release();
          Updated(0);
       }
       
     }
   });
   
  socket.on('disconnect',message=>{
    socket.broadcast.emit('left',users[socket.id]);
    delete users[socket.id];
    activeUsers.pop(users[socket.id]);
    typers.pop(users[socket.id]);
    check_null(users);
  });
});

function check_null(users){
  Object.entries(users).forEach(([k,v])=>{
    if(v===null)
    {
      delete users[k];
    }
  });
}

function mailRecieverLoad(reciever,OTP)
{
  let mailOptions = {
  from: 'streaksa1251@gmail.com',
  to: reciever,
  subject: 'OTP-Streaks🔥',
  text: 'OTP- '+OTP
};
  return mailOptions;
}

async function mailSend(mailOption)
{
  console.log("Flag is set to zero");
  try{
     const info= await transporter.sendMail(mailOption);
    console.log("Email sent successfully");
    console.log("Email info",info.response);
    return 1;
   }catch(error){
     console.error(error);
     return 0;
   }
}
function Otp(){
  return Math.floor(Math.random()*(9999-1000+1)+1000);
}
