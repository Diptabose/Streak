const socket=io.connect('', {
  'reconnection': true,
  'reconnectionDelay': 100,
  'reconnectionAttempts': 100
});
let btn=document.getElementById("continue");
let otp_entered=document.getElementById("Otp");
let Timer=document.getElementById("timer");
let body=document.getElementById("body");


 RemainingTime(60);
function RemainingTime(sec)
{
  var time=setInterval(function timeron(){
    sec=sec-1;
    if(sec===-1){
      Timer.classList.add("timehide");
      // Allow to resend the Otp
      clearInterval(time);
      btn.removeEventListener("click",OtpValid);
      btn.innerText="Resend";
      btn.addEventListener("click",ResendOTP);
    }
    else{
    Timer.innerText="Resend OTP in "+sec+" secs";
    }
  },1000)
}






btn.addEventListener("click",OtpValid);
function OtpValid()
{
    console.log(otp_entered.value);
    if(String(otp_entered.value)==window.sessionStorage.getItem('OTP'))
     {
       console.log("Fetching Details...");
       var UserName= window.localStorage.getItem("uname");
       var UserMail= window.sessionStorage.getItem("umail");
       var UserPassword=window.sessionStorage.getItem("upassword");
      
      console.log("We are abou to send to server"); 
     socket.emit("RegisterUser",UserName,UserMail,UserPassword,(value)=>{
       console.log("Atleast are we i side callback?");
         if(value===0)
         {
           console.log("Access to streaks denied");
         }
         else if(value===1){
         window.localStorage.setItem('streakscore',"0");
         window.localStorage.setItem('UpdatedTime',"0");
         window.localStorage.setItem('LoginDone',"1");
           document.location.replace("Streaks1.html");
         }
       });
     }
     else{
       console.log("Triggering else");
       document.getElementById("redinvalid").innerHTML="Invalid OTP. Enter again !!!";
       document.getElementById("redinvalid").style.color="red";
       document.getElementById("Otp").value="";
  }
}

function ResendOTP(){
 btn.innerText="Continue";
 console.log("Resend is pushed ");
  var UserMail= window.sessionStorage.getItem("umail");
  console.log("User mail fetched ",UserMail);
  socket.emit("ResendOTP",UserMail,(value)=>{
    console.log("Call back from server");
    console.log("Value of OTP",value);
    if(value===0)
    {
      
      console.log("Error occured at server,Resending OTP automatically after 60 sec");
      btn.innerText="Wait";
      btn.removeEventListener('click',ResendOTP);
      RemainingTime(60);
      setInterval(function(){
      ResendOTP();
      },60000);
    }
    else
    {
      console.log("We are in else ");
      btn.innerText="Continue";
    window.sessionStorage.setItem('OTP',value);
    btn.addEventListener("click",OtpValid);
    }
    
  });
  
  
}
