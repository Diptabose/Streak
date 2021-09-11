var btn= document.getElementById("continue");
var username = document.getElementById("name");



btn.addEventListener("click",otpgen);

function otpgen(){
 
  window.localStorage.setItem("uname",username.value);
  OTP_generate();
  //btn.removeEventListener("click",otpgen);
}

function OTP_generate(){
  
       var otp=Math.floor(Math.random() * (9999 - 1000+ 1)) + 1000;
       console.log(otp);
       window.sessionStorage.setItem('OTP',otp);

       var reciever =document.getElementById('mailsend').value;
       window.sessionStorage.setItem('Reciever',reciever);
       console.log(reciever);
        
        console.log(otp);
        Email.send({ 
        Host: "smtp.gmail.com", 
        Username: "streaksa1251@gmail.com", 
        Password: "bose1234", 
        To: window.sessionStorage.getItem("Reciever"), 
        From: "streaksa1251@gmail.com", 
        Subject: "Streaks", 
        Body: "OTP- "+window.sessionStorage.getItem('OTP'),
        })/*.then(
		message => alert("mail sent successfully")*/.then(function(){
       	  document.location="OTP.html";
       	});
    }
 
