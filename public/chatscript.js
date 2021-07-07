const socket=io();

let sendbtn=document.getElementById("SendText");
let TextInp=document.getElementById('InpText');
let messageContainer=document.querySelector(".chatarea");
const audio_send=new Audio('Send.mp3');
const audio_recieve=new Audio('Recieve.mp3');

function append(message,position)
{
 const messageElement=document.createElement('div');
 TextInp.focus();
 messageElement.innerText=message;
 messageElement.classList.add('message');
 messageElement.classList.add(position);
 messageContainer.append(messageElement);
 messageContainer.scrollTop=messageContainer.scrollHeight;
 if(position=='left')
 {
   audio_recieve.play();
 }
 else{
   audio_send.play();
 }
}

function appendImg(path,mpos,ipos,name)
{
  const messageElement=document.createElement('div');
  var chatimg=document.createElement('img');
  messageElement.append(name+":");
  chatimg.src=path;
  chatimg.classList.add(ipos);
  messageElement.append(chatimg);
  messageElement.classList.add(mpos);
  messageElement.classList.add('message');
 // messageElement.classList.add('message');
 // messageElement.classList.add(position);
  messageContainer.append(messageElement);
  messageContainer.scrollTop=messageContainer.scrollHeight;
}














sendbtn.addEventListener('click',(event)=>{
  event.preventDefault();
  const message=TextInp.value;
  if(message=="")
  {
    TextInp.focus();
    return;
  }
  append(`You:${message}`,'right');
  socket.emit('send',message);
  TextInp.value="";
  TextInp.focus();
});

const name=window.prompt('Enter name');
socket.emit('new-user-joined',name);

socket.on('user-joined',name=>{
  append(`${name} joined the chat`,'right');
});

socket.on('recieve',data=>{
  append(`${data.name}:${data.message}`,'left');
});

socket.on('left',name=>{
append(`${name} left the chat`,'right');
});

const fileup=document.getElementById("fileupload");
var imgpath;
fileup.addEventListener('change',()=>{
//var demoImage = document.getElementById('sendimg');
//var recieveimg=document.getElementById('recieveimg');
var file=fileup.files[0];
var reader=new FileReader();

reader.addEventListener('load',(event)=>{
  
 var imgElement=document.createElement('img');
 
 imgElement.src=reader.result;
 
 imgElement.addEventListener('load',(e)=>{
   
 var canvas=document.createElement('canvas');
 const MAX_WIDTH=200;
 const scaleSize=MAX_WIDTH/imgElement.width;
 canvas.width=MAX_WIDTH;
 canvas.height=imgElement.height;
 const ctx=canvas.getContext("2d");
 ctx.drawImage(imgElement,0,0,canvas.width,canvas.height);
 var srcEncoded=ctx.canvas.toDataURL(imgElement,"image/*",2);
 imgpath=srcEncoded.replace(/.*base64,/, '');
 socket.emit('image',imgpath);
socket.on('recieveimg',imgdata=>{
  /* recieveimg.addEventListener('load',()=>{
     console.log("recieved");
   });*/
   appendImg(`data:image/jpg;base64,${imgdata.path}`,'left','ileft',imgdata.name);
  //recieveimg.src=`data:image/jpg;base64,${imgpath}`; 
 });
 
 //recieveimg.src=reader.result;
});
appendImg(reader.result,'right','iright','You:');
//demoImage.src=reader.result;
});
reader.readAsDataURL(file);
});
