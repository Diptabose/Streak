const socket=io();

const uname=window.localStorage.getItem("uname");
let sendbtn=document.getElementById("SendText");
let TextInp=document.getElementById('InpText');
let messageContainer=document.querySelector(".chatarea");
var flag=true;
let bodyfix=document.getElementById("bodyfix");
let onlineBox=document.getElementById('onlinelist');
let type=document.getElementById("typing");
let onlineBtn=document.getElementById('onlinebtn'); 
var a= document.getElementById("onid");
const audio_send=new Audio('Send.mp3');
const audio_recieve=new Audio('Recieve.mp3');
var flag=true;

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
  typerup();
  const message=TextInp.value;
  if(message=="")
  {
    TextInp.focus();
    return;
  }
  append(`You:${message}`,'right');
  TextInp.value="";
  TextInp.focus();
  socket.emit('send',message);
  
});

TextInp.addEventListener('focus',(event)=>{
  console.log("Focused and changed");
 
document.getElementById("logofix").classList.remove("logoimg");
document.getElementById("logofix").classList.add("Logofix");
document.getElementById("pfix").classList.add("Pfix");
});

TextInp.addEventListener("blur",(event)=>{

document.getElementById("logofix").classList.remove("Logofix");
document.getElementById("logofix").classList.add("logoimg");
document.getElementById("pfix").classList.remove("Pfix");
  
});

function addOnlineUser(actvuser)
{
  actvuser.forEach((item)=>{
    if(item==null||undefined)
    {
     // console.log("item is null");
    }
    else if(item==uname)
    {
      //console.log("my name so dont print");
    }
    else{
    const useronline=document.createElement('li');
 useronline.setAttribute('id',item);
 useronline.setAttribute('class','on');
 useronline.innerText=item;
 onlineBox.append(useronline);
    }
  });
    
}
function removeOnlineUser(offuser)
{
  document.getElementById(offuser).remove();
}

var flag1=true;
console.log("Initial flag is true");
function typerdown(event){
  if(flag===true)
  {
  const key=event.key;
  if(event.getModifierState('CapsLock')|| event.ctrlKey||event.shiftKey||key==="Backspace"||key==="Enter")
  {
    console.log("Event not recorded");
  }
 else {
   flag=false;
   socket.emit("keyisdown",uname);
   console.log("name sent to server");
   removeandaddlistener();
 }
  }
}

function removeandaddlistener()
{
  if(flag===false)
  {
    TextInp.removeEventListener('keydown',typerdown);
    console.log("keydown is removed");
  } 
    setTimeout(function() {
     flag=true;
   TextInp.addEventListener('keydown',test);
  typerup();
 
    }, 2200);
   
  }
  
TextInp.addEventListener('keydown',typerdown);

function test(){
  TextInp.addEventListener('keydown',typerdown);
}

function typerup(){
  socket.emit("removetyper",uname);
}

socket.on("removefromothers",()=>{
    document.getElementById("typerstring").innerText="";
});

socket.on("returntypers",(typers)=>{
  
  var len=typers.length;
  var joining="is";
  let str= typers.join(", ");
  if(len===0)
  {
    document.getElementById("typerstring").innerText="";
  }
  else if(len===1)
  {
  str1=str+" "+joining+" typing...";
  }
  else if(len===2)
  {
    var join="are";
    str1=str+" "+join+" typing...";
  }
  else if(len>2)
  {
    str1= typers[0]+", "+typers[1]+" and"+(len-2)+" others are typing...";
  }
  //console.log(str1);
  document.getElementById("typerstring").innerText=str1;
  
});


socket.emit('new-user-joined',uname);
socket.on('user-joined',name=>{
  append(`${name} joined the chat`,'right');
});

socket.on('online',currentname=>{
  addOnlineUser(currentname);
      });
      
socket.on("ionline",activeUsers=>{
  addOnlineUser(activeUsers);
});

socket.on('recieve',data=>{
  append(`${data.name}:${data.message}`,'left');
});

socket.on('left',name=>{
  if(name==null||undefined)
  {
    socket.emit('removenull');
  }
 else{ 
   append(`${name} left the chat`,'right');
   removeOnlineUser(name);
}
});
