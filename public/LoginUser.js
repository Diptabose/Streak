const socket=/*io('http://localhost:8000');*/io.connect('', {
  'reconnection': true,
  'reconnectionDelay': 100,
  'reconnectionAttempts': 100
});
var passError=document.getElementById("passerror");
var pass=document.getElementById("password");
var mailError=document.getElementById("mail_error");
var mail=document.getElementById("mailsend");
var btn= document.getElementById("continue");
var inputs= document.getElementsByTagName('input');


btn.addEventListener('click',()=>{
  if(mail.value=="")
  {
    mailError.innerHTML="Field empty";
    showerror(mailError,mail);
  }
  else if(pass.value==""||pass.value.length<8)
  {
    passError.innerHTML="Minimum 8 character password required";
    showerror(passError, pass);
  }
  else{
socket.emit('LoginUser',mail.value, pass.value,(registeredUser)=>{
  var type= typeof registeredUser;
  if(registeredUser==0)
  {
    showerror(passError,pass);
    pass.value="";
  }
  else if(registeredUser==-1)
  {
    mailError.innerHTML="Error Occured"
    showerror(mailError,mail);
  }
  else if(type=="string"){
  var parseUser= JSON.parse(registeredUser);
  window.localStorage.setItem('uname',parseUser.rows[0].username);
  window.localStorage.setItem('scorecount',parseUser.rows[0].streakscore);
  window.localStorage.setItem('UpdatedTime',parseUser.rows[0].updatedtime);
 window.localStorage.setItem('LoginDone','1');
  document.location.replace('Streaks1.html');
}
else{
  document.location.replace('Error.html');
  }
}
  );}
});

function showerror(x,y)
{
  console.log("We are inside showerror");
  console.log(x);
  x.classList.remove("rederrormsg");
  x.classList.add("showrederrormsg");
  y.classList.add("redborderforinput");
}

inputs.forEach(function(item){
  item.addEventListener('input',function(){
    if(item.classList.contains('redborderforinput'))
    {
      item.classList.remove('redborderforinput');
    }
  });
});
