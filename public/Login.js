const socket=io();
var serverError=document.getElementById("Servererror");
var username = document.getElementById("name");
var passError=document.getElementById("passerror");
var pass=document.getElementById("password");
var conpassError=document.getElementById("conpass_error");
var con_pass=document.getElementById("con_pass");
var mailError=document.getElementById("mail_error");
var mail=document.getElementById("mailsend");
var btn= document.getElementById("continue");
var inputs= document.getElementsByTagName("input");
var ps= document.getElementsByTagName('p');
btn.addEventListener("click",validateDetails);
function validateDetails(){
  const pass_Length=pass.value.length;
  if(username.value=="")
  {
    serverError.innerHTML="Field empty";
    username.focus();
    showerror(serverError,username);
  }
 else if(pass_Length<8)
  {
    pass.focus();
    showerror(passError,pass);
  }
  else if(pass.value!=con_pass.value)
  {
     con_pass.focus();
    showerror(conpassError,con_pass);
  }
  else if(mail.value=="")
  {
    mail.focus();
    showerror(mailError, mail);
  }
  else{
emailValid(mail.value).then((data)=>{
  if(data){
 socket.emit("InsertUser",username.value,mail.value,pass.value,(eValue)=>{
  if(eValue===0)
 {
 // console.log("Value of entry from if:",eValue);
  username.focus();
  serverError.innerHTML="Username exists!!!"
  showerror(serverError,username);
  username.value="";
 }
 else if(eValue==-1)
 {
     serverError.innerHTML="Username Insert Error!!! Try Again";
     showerror(serverError,username);
  username.value="";
     
 }
 else if(eValue==-2)
 {
   serverError.innerHTML="Internal Server Error!!!";
   showerror(serverError,username);
   username.value="";
 }
 else if(eValue==1)
 {
  // console.log("Value of entry from else value 1:",eValue);
  window.localStorage.setItem("uname",username.value);
  window.sessionStorage.setItem("umail",mail.value);
  window.sessionStorage.setItem("upassword",pass.value);
  window.localStorage.setItem('streakscore',"0");
  window.localStorage.setItem('UpdatedTime','0');
 // window.sessionStorage.setItem('OTP',eValue);
   document.location="Streaks1.html";
 }
 });
}
else{
  showerror(mailError,mail);
}
});
}
}
function showerror(x,y)
{
  //console.log("We are inside showerror");
 // console.log(x);
  x.classList.remove("rederrormsg");
  x.classList.add("showrederrormsg");
  y.classList.add("redborderforinput");
}

async function emailValid(email){
  var url = "https://emailvalidation.abstractapi.com/v1/?api_key=9a817cf66fd24c489dc2c04323c9df4a&email="+email;
  var emailCheck= await fetch(url);
  var respjson= await emailCheck.json();
 // console.log(respjson);
  if(respjson.deliverability=="DELIVERABLE"||respjson.is_mx_found.text=="TRUE")
  {
    return true;
  }
  else{
    return false;
  }
}

inputs.forEach(function(item){
  item.addEventListener('input',function(){
    if(item.classList.contains('redborderforinput'))
    {
      item.classList.remove('redborderforinput');
    }
  });
});
