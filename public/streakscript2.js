const socket=io();

  
  

var score= document.getElementById("score");
var ichat=document.getElementById("ichat");
var about=document.getElementById("about");
//score.style.borderBottom="4px solid black";
var ContentPage=document.getElementById("Contentid");
var ChatPage=document.getElementById("Chatid");
var AboutPage=document.getElementById("AboutPageid");
var UpdateBtn=document.getElementById("update");
var StreakScore= document.getElementById("streakscore");
/*var ScrollContent=document.getElementById("contentscroll");*/
var dark_toggle=document.getElementById("switch");
//var theme=document.getElementById("theme-link");
//var menu= document.getElementById("menu");
var setting_button_click=document.getElementById("settings");
/*var scrollContent= document.querySelector(".contentscroll");*/
/*var body=document.getElementById("body");*/
var Timer=document.getElementById("timer");
var TimerLogo=document.getElementById("timerlogo");
var pop= document.getElementById('popup');
var chatClick= document.getElementsByClassName('chatLink');
var logout = document.getElementById('logout');
  var UserName=window.localStorage.getItem("uname");

setting_button_click.addEventListener('click',()=>{
  pop.classList.toggle('slidemenuWidth50');
  document.getElementById('blocker').classList.toggle('blocker');
});
document.getElementById('blocker').addEventListener('click',()=>{
  pop.classList.toggle('slidemenuWidth50');
  document.getElementById('blocker').classList.toggle('blocker');
});


logout.addEventListener('click',()=>{
  var confirmLeave=window.confirm('Do you want to Logout?');
  if(confirmLeave)
  {
    window.localStorage.removeItem('LoginDone');
    document.location.replace('Login.html');
  }
})
/*chatClick.forEach(function(item){
  console.log(item);
  item.addEventListener('click',function(){
    document.location="Chat1.html";
  });
});*/
for(var i=0;i<chatClick.length;i++)
  {
    chatClick[i].addEventListener("click",function(){
            document.location="Chat1.html";
                                  });
  }

unction DomLoad(){
  document.getElementById("userinsert").innerText="Welcome "+UserName;
  document.getElementById("cname").innerHTML=UserName;
  var scoreFromMem=Number(window.localStorage.getItem('streakscore'));
  var upt=Number(window.localStorage.getItem("UpdatedTime"));
 var d = new Date();
  if(scoreFromMem==100){
      StreakScore.innerText="💯";
  }
  else{
  StreakScore.innerText=String(scoreFromMem);
 //console.log(StreakScore);
  }
  
  if(upt===0)
  {
    UpdateBtn.addEventListener("click",Updater);
  }
  else if(upt!=0)
  {
   var et=Math.floor((d.getTime()-upt)/1000);
   console.log("The actual time: "+d.getTime());
   console.log("Updated Time: "+parseInt(upt));
   console.log("ElapsedTime: "+et);
   if(et>100800)
   {
     //Update streaks on server;
     window.localStorage.setItem("streakscore","0");
     Timer.innerText="Time Remaining:00:00:00";
    UpdateBtn.addEventListener("click",Updater);
    updateDetailsOnServer("0",0);
   }
   else if(et>86400&&et<100800){
     TimerLogo.innerText="⏳"
     Timer.innerText="Time Remaining:00:00:00";
     UpdateBtn.addEventListener("click",Updater);
   }
   else if(et<86400)
   {
     var eth=CalH(et);
     var etm=CalM(et);
     var ets=CalS(et);

     RemainingTime((23-(eth)),(59-(etm)),(59-(ets)));
     UpdateBtn.removeEventListener("click",Updater);
   }
  }
}
  
  
  function CalH(sec){
    var hr = Math.floor(sec/3600);
    console.log(hr);
    return hr;
  }
  function CalM(sec){
    var dhr=sec/3600;
    var hr= Math.floor(sec/3600);
    var fh = Math.floor((dhr-hr)*60);
    console.log(fh);
    return fh;
  }
  function CalS(sec){
    var hr=Math.floor(sec/3600);
    var dhr= sec/3600;
    var sm=(dhr-hr)*60;
    var ms= Math.floor(sm);
    var fs=Math.floor((sm-ms)*60);
    return fs;
  }

function Updater(){
  var d= new Date();
  window.localStorage.setItem("UpdatedTime",JSON.stringify(d.getTime()));
  TimerLogo.innerText="";
  console.log("Update is clicked");
  var text=Number(window.localStorage.getItem("streakscore"));
  text=text+1;
  window.localStorage.setItem("streakscore",text.toString());
  if(text===100)
  {
    StreakScore.innerText="💯";
  }
  else{
 StreakScore.innerText=window.localStorage.getItem("streakscore");
  }
 UpdateBtn.removeEventListener("click",Updater);
 RemainingTime(23,59,59);
 updateDetailsOnServer(String(d.getTime()),text);
}

function RemainingTime(h,m,s)
{
  var time=setInterval(function timeron() {
    s=s-1;
    if(s===0&&m==0)
    {
      s=59;
      m=59;
      h=h-1;
      if(h<0)
      {
        h=0;m=0;s=0;
      UpdateBtn.addEventListener("click",Updater);
        clearInterval(time);
      }
    }
    if(m>0&&s===0)
    {
      s=59;
      m=m-1;
    }
    if(s<0)
    {
      clearInterval(time);
      h=0;m=0;s=0;
      UpdateBtn.addEventListener("click",Updater);
    }
    Timer.innerText="Time Remaining:"+h+":"+m+":"+s;
  }, 1000);
}

function updateDetailsOnServer(time,nullInc){
   const id=setTimeout(function errorPage(){
    // document.location.reload(1);
    document.location.replace="Error.html";
  },8000);
    socket.emit("StkTimeUpt",UserName,time, nullInc,(confirm)=>{
      if(confirm==1)
      {
        clearTimeout(id);
      }
    });
}

score.addEventListener('click',()=>{
  ContentPage.scrollIntoView(true);
  console.log("clicked")
});
ichat.addEventListener('click',()=>{
  ChatPage.scrollIntoView(true);
});
about.addEventListener('click',()=>{
  AboutPage.scrollIntoView(true);
});

//DomLoad();

   
