var score= document.getElementById("score");
var ichat=document.getElementById("ichat");
var about=document.getElementById("about");
score.style.borderBottom="3px solid black";
var ContentPage=document.getElementById("Contentid");
var AboutPage=document.getElementById("AboutPageid");
var UpdateBtn=document.getElementById("update");
var StreakScore= document.getElementById("streakscore");
const d= new Date();
console.log(d.getTime());
var body=document.getElementById("body");
var Timer=document.getElementById("timer");
var TimerLogo=document.getElementById("timerlogo");


body.onload=function Load(){
  
  var d= new Date();
  
  document.getElementById("userinsert").innerText="Welcome "+window.localStorage.getItem("uname");
  
  if(Number(window.localStorage.getItem("scorecount"))===100){
      StreakScore.innerText="💯";
  }
  else{
    StreakScore.innerText=window.localStorage.getItem("scorecount");
  }
  
  var upt=window.localStorage.getItem("UpdatedTime");
  
  if(upt===null)
  {
    UpdateBtn.addEventListener("click",Updater);
  }
  else if(upt!=null)
  {
   var et=Math.floor((d.getTime()-parseInt(upt))/1000);
   console.log("The actual time: "+d.getTime());
   console.log("Updated Time: "+parseInt(upt));
   console.log("ElapsedTime: "+et);
   if(et>100800)
   {
     window.localStorage.setItem("streakscore","0");
     //window.localStroage.removeItem("UpdatedTime");
     Timer.innerText="Time Remaining:00:00:00";
     
     UpdateBtn.addEventListener("click",Updater);
   }
   else if(et>86400&&et<100800){
     
     TimerLogo.innerText="⏳";
     Timer.innerText="Time Remaining:00:00:00";
     UpdateBtn.addEventListener("click",Updater);
     
   }
   else if(et<86400)
   {
     var eth=CalH(et);
     var etm=CalM(et);
     var ets=CalS(et);
    /* var Upt=Math.floor(parseInt(upt)/1000);
     console.log("UpdatedTime in Seconds when button clicked :"+Upt);
     var Ct=Math.floor(d.getTime()/1000);
     console.log("Current Time in Seconds : "+Ct);
     var uph=CalH(Upt);
     console.log("Updated Hour :"+uph);
     var upm=CalH(Upt);
     console.log("Updated Min :"+upm);
     var ups=CalS(Upt);
     console.log("Updated Sec :"+ups);
     var ch=CalH(Ct);
     console.log("Current Hour :"+ch);
     var cm= CalM(Ct);
     console.log("Current Min :"+cm);
     var cs=CalS(Ct);
     console.log("Current Sec :"+cs);*/
     RemainingTime((23-(eth)),(59-(etm)),(59-(ets)));
     
     //computations on current time - lastleft time and passing it to timer();
     UpdateBtn.removeEventListener("click",Updater);
   
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

};

//UpdateBtn.addEventListener("click",Updater);

function Updater(){
  console.log("Update is clicked");
  var d= new Date();
  var text=Number(window.localStorage.getItem("scorecount"));
  text=text+1;
 window.localStorage.setItem("UpdatedTime",JSON.stringify(d.getTime()));
 console.log(window.localStorage.getItem("UpdatedTime"));
  window.localStorage.setItem("scorecount",text.toString());
  TimerLogo.innerText="";
  if(text===100)
  {
    StreakScore.innerText="💯";
  }
  else{
 StreakScore.innerText=window.localStorage.getItem("scorecount");
  }
 UpdateBtn.removeEventListener("click",Updater);
 RemainingTime(23,59,59);
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


/*window.onbeforeunload=

function ubishhh()
{
    window.localStorage.setItem("lefttime",JSON.stringify(d.getTime()));
    return null;
};*/





score.addEventListener('click',()=>{
  
  ContentPage.classList.add("Content");
  ContentPage.classList.remove("ContentHide");
  AboutPage.classList.remove("AboutPage");
  AboutPage.classList.add("AboutPageHide");
  console.log("Score page classes changed");
  about.style.borderBottom="none";
  score.style.borderBottom="3px solid black";
});

ichat.addEventListener('click',()=>{
  
 // window.localStorage.setItem("lefttime",JSON.stringify(d.getTime()));
  document.location="Chat1.html";
});

about.addEventListener("click",()=>{
  ContentPage.classList.remove("Content");
  AboutPage.classList.remove("AboutPageHide");
  ContentPage.classList.add("ContentHide");
  AboutPage.classList.add("AboutPage");
  console.log("About Page classes changed");
  score.style.borderBottom="none";
  about.style.borderBottom="3px solid black";
});











/*body.onload=function ubishgang(){
 // console.log("in in onload");
 // console.log(window.localStorage.getItem("lefttime"));
  setTimeout(function() {
    var login=window.localStorage.getItem("LoginDone");
    Intro.classList.remove("intro");
    Intro.classList.add("introHide");
    if(login===null)
    {
      document.location="Login.html";
    }
    else if(Number(login)===1)
    {
      var lasttime=Number(document.localStorage.getItem("lefttime"));
      var f = new Date();
      var a=(f.getTime())-lasttime;
      if(a>100800)
      {
        window.localStorage.setItem("scorecount","0");
        Timer.innerText="Time Remaining: 00:00:00";
        UpdateBtn.addEventListener("click",Updater);
       }
     else if(a>86400&&a<100800){
        UpdateBtn.addEventListener("click",Updater);
    //RemainingTime(23,59,59);
          }
     else if(a<86400)
      {
        var hr = a/3600;
        var mi= Math.round((a%3600)*60);
        var se= Math.round((((a%3600)*60)%1)*60);
        RemainingTime(hr,mi,se);
       }
    body.classList.remove("body");
    body.classList.add("bodyRemove");
    Main.classList.remove("mainHide");
    }
  }, 1200);
};*/
