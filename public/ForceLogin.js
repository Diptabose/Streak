const socket=io();
let oldUser=window.localStorage.getItem('isOld');
if(oldUser==null||oldUser==undefined||oldUser=="1")
{
let name= window.localStorage.getItem('uname');
if(name==null||name==undefined)
{
  
}else{
socket.emit('CheckOutdatedVersionUser',name,(verified)=>{
  if(verified==false)
  {
    document.location.replace('Login.html');
  }
  else if(verified==-1)
  {
  document.location.replace('Error.html');
  }
  else if(verified==true){
    window.localStorage.setItem('isOld',"0");
  }
}
}
}
