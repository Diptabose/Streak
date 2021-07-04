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
 if(position=='left')
 {
   audio_recieve.play();
 }
 else{
   audio_send.play();
 }
}
sendbtn.addEventListener('click',(event)=>{
  event.preventDefault();
  const message=TextInp.value;
  if(message=="")
  {
    alert('enter text');
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
