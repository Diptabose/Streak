
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

 res.sendFile(path.join(__dirname,'public',INDEX));

}).listen(PORT,()=>console.log('listening..'));

global.io=socketIO(app);

let transporter = nodemailer.createTransport({

  service: 'gmail',
  port:465,
  secure:true,
  auth: {

    user: 'diptabose484@gmail.com',

    pass: 'immortal@ironman'

  }

});

const pool=new pg.Pool({

 connectionString: /*process.env.DATABASE_URL*/"postgres://bose:SYzpviADLEWrKI63yCgRAYrPSYnxaSc6@dpg-ce1g2jen6mpu84vvh81g-a.singapore-postgres.render.com/streaks_db",

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
// console.log(res);
 await client.release();
 var offset=0;
 let USERNAME=null;
  socket.on("FetchMsg",async(newserverend,sendMsgJson)=>{
    const client= await pool.connect();
    try{
      const res= await client.query('select * from (select * from messages order by chatno desc limit $1) as allmsgs offset $2 limit 50 ',[ServerEnd,offset]);
      //console.log(res.rows);
      if(res.rows.length!=0){
      const JsonRes=await JSON.stringify(res.rows);
       //console.log(JsonRes);
      sendMsgJson(JsonRes);
      await client.release();
      offset+=50;
      }
    }catch(error)
    {
     // console.error(error);
      await client.release();
    }
  });

  socket.on('new-user-joined',async(name,test)=>{

    //console.log('User',name);  

    users[socket.id]=name;
    USERNAME=name;
    activeUsers.push(name);
   let copyActUsers=[...activeUsers];
   // socket.broadcast.emit('user-joined',name);
  // socket.emit('ionline',copyActUsers);
   //socket.broadcast.emit("online",activeUsers);
    //socket.emit("ionline",activeUsers);
    test(1);
  });


 socket.on('CheckOutdatedVersionUser',async(name,verify)=>{
        const client=await pool.connect();
        try{
         const res= await client.query('select username from login where username=$1',[name]);
         if(res.rowsCount>0)
          {
           verify(true);
           }
         else{
          verify(false);
          }
         }
        catch(error)
         {
          verify(-1);
          await client.release();
          }
      await client.release();
 });

  socket.on('send',async(sender,message)=>{

    socket.broadcast.emit('recieve',{message:message,name:sender});

    

    const client= await pool.connect();

    try{
      const res= await client.query('insert into messages(sender,msg) values($1,$2)',[sender , message]);
     // console.log("Msg inserted");
      await client.release();
    }
    catch(error)
    {
      //console.error(error);
      await client.release();
    }
  });

 socket.on("InsertUser",async (name,mail,password,verifyuser)=>{
   let entry;
  // console.log("Transfer shifted to server");
   const client = await pool.connect();
  // console.log("Client connceted");
   try{
   const res= await client.query(`select username,email from login where username=$1 and email=$2`,[name,mail]);
    // console.log(res.rowCount);
      if(res.rowCount>0)
      {
       // console.log("User present already");
        verifyuser(0);
        await client.release();
      }
      else{
     /*   const OTP= Otp();
        console.log(mail);
        console.log("OTP is "+ OTP);
        const mailOption=mailRecieverLoad(mail,OTP);
        mailSend(mailOption);
        verifyuser(OTP);*/
    // console.log("Inserting user in db");
     try{
     const res1= await client.query('insert into login(username,email,password)values($1,$2,$3)',[name,mail,password]);
       //console.log(res1);
       verifyuser(1);
     }
     catch(err)
     {
      // console.error(err);
       verifyuser(-1);
       await client.release();
     }
      }
   }catch(err){
     verifyuser(-2);
    // console.error(err);
     await client.release();
   }
    }
   );

   

   /*socket.on("ResendOTP",(mail,resendOtp)=>{

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

   */

   /*socket.on("RegisterUser",async (name,mail,password,Streaks)=>{
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
   });*/

   socket.on('LoginUser',async (mail, password,confirm)=>{

     console.log('Checking for login user');

      const client = await pool.connect();

     try{

       const res= await client.query('select * from login where email=$1',[mail]);

     //  console.log(res)

       

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

      // console.error(error);

       await client.release();

     }

   });

   

   socket.on("StkTimeUpt",async (name,utime,value,Updated)=>{
     const client = await pool.connect();
       try{
         const res= await client.query('update login set streakscore=$1,updatedtime=$2 where username=$3',[value,utime,name]);
        // console.log(res);
         await client.release();
         Updated(1);
       }
       catch(error)
       {
         Updated(0);
        // console.error(error);
         await client.release();
       }
   });
  socket.on('disconnect',message=>{
    socket.broadcast.emit('left',USERNAME);
    delete users[socket.id];
   let actIndex=activeUsers.indexOf(USERNAME);
   activeUsers.splice(actIndex,1);
    //activeUsers.pop(users[socket.id]);
    //typers.pop(users[socket.id]);
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

/*function mailRecieverLoad(reciever,OTP)

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

}*/
