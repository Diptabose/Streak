const socket=io();
let sendbtn=document.getElementById("SendText");
let TextInp=document.getElementById('InpText');
let messageContainer=document.querySelector(".chatarea");
let onlineBox=document.getElementById('onlinelist');
let type=document.getElementById("typing");
 var header= document.getElementById("chat");
 
 let typer1=document.getElementById("sending1");
 let typer2=document.getElementById("sending2");
 let typer3=document.getElementById("sending3");
 
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
  initTypers();
  socket.emit('Typers',uname);
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
/*TextInp.addEventListener('focus',()=>{
  var header= document.getElementById("chat");
   header.className="chatarea2";
   var scroll=header.scrollDown;
   console.log(scroll);
   var heights=header.scrollHeight;
   console.log(heights);
})*/
/*// Get the header
var header = document.getElementById("myHeader");
// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}*/
/*var count=0;
console.log("hello");
function typing()
{
  var users=['Ram is typing...'];
   users.forEach((item)=>{
  if(count<=3)  
  {
 var typinglist= document.createElement('li');
 typinglist.innerText=item;
  type.append(typinglist);
  count=count+1;
    
  }  
  else if(count>4)
        users.pop();
        count--;
   });
  
}*/

const uname=window.prompt('Enter name');
function addOnlineUser(actvuser)
{
  actvuser.forEach((item)=>{
    if(item==null)
    {
      
    }
    else if(item==uname)
    {
      
    }
    else{
    const useronline=document.createElement('li');
 useronline.setAttribute('id',item);
 useronline.setAttribute('class','on')
 useronline.innerText=item;
 onlineBox.append(useronline);
    
    }
  });
}
function removeOnlineUser()
{
    var onuse=document.querySelectorAll('.classname');
    onuse.forEach(item=>{
      item.remove();
    });
}

function removeTypers()
{
  document.getElementById("sending1").remove();
  document.getElementById("sending2").remove();
  document.getElementById("sending3").remove();
  
}
function initTypers(){
  socket.emit("Typers",uname);
}
socket.on('typersarray',typers=>{
  removeTypers();
  
  var len=typers.length;
  if(len==0)
  {
    removeTypers();
  }
  if(len==1)
  {
    typer1.innerText=typers[0]+" is typing...";
  }
  if(len==2)
  {
    typer1.innerText=typers[0]+" is typing...";
    typer2.innerText=typers[1]+" is typing...";
    
  }
  if(len==3)
  {
    typer1.innerText=typers[0]+" is typing...";
    typer2.innerText=typers[1]+" is typing...";
 typer3.innerText="and "+len-2+" are typing...";
  }
});










socket.emit('new-user-joined',uname);

socket.on('user-joined',name=>{
  append(`${name} joined the chat`,'right');
 
});

socket.on('online',activeUsers=>{
  addOnlineUser(activeUsers);
})




socket.on('recieve',data=>{
  append(`${data.name}:${data.message}`,'left');
});

socket.on('left',name=>{
  if(name==null)
  {
    socket.emit('removenull')
  }
 else{ 
append(`${name} left the chat`,'right');
removeOnlineUser();
}
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
