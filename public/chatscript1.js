const socket=io();
  
  
 


var userCount=0;
let type=document.getElementById("typing");
var popupOpen=document.getElementsByClassName('popup');
var theme=document.getElementById("ChatTheme");
let onlineBtn=document.getElementById('onlinebtn'); 
var onlineShow=document.getElementById("onlineShow");
var onlineHide=document.getElementById("onlineHide");
var headerColor= document.getElementById("HtmlColorPickerHead");
var bodyColor=document.getElementById("HtmlColorPickerBody");
var headerTextWhite=document.getElementById("headerTextWhite");
var bodyColorWindow=document.querySelector(".bodyColor");
var headerColorWindow=document.querySelector(".headerColor");
var ThemeChanger= document.querySelector(".ThemeChanger");
var dotInChat=document.getElementById("3dotsInChat");
var chatThemeSettingsView=document.getElementById("chatThemeSettingsView");

var showSettingsMenu= document.getElementById("showSettingsMenu");
var hideSettingsMenu=document.getElementById("hideSettingsMenu");
var themeSelect = document.getElementsByClassName("ColorPicker");

var showTheme=document.getElementById("showTheme");
var hideTheme=document.getElementById("hideTheme");

var savingTheme=-1;
var HeadColor=null;
var BodyColor=null;
themeArray=[
  {head:"linear-gradient(to right,#1ea785,#1ea785)",body:"url('/Chatbg.png')"},
  {head:"linear-gradient(to right , blue , white)",body:"linear-gradient(to top right , red,white)"},
  {head:"linear-gradient(to right , blue , green)",body:"linear-gradient(to top right , red,black)"},
  {head:"linear-gradient(to right , blue , white)",body:"linear-gradient(to top right ,yellow,red)"},
   {head:"linear-gradient(to right , blue , red)",body:"linear-gradient(to top right , red,orange)"},
  {head:"linear-gradient(to right , blue,pink)",body:"linear-gradient(to top right , red,pink)"}
];
var root= document.querySelector(':root');
var themeStateInMemory=JSON.parse(window.localStorage.getItem("themeState"));
if(!(themeStateInMemory==undefined||themeStateInMemory==null))
{
 var index=Number(themeStateInMemory.index);
 if(index!=-1)
 {
   themeChanger(index);
   savingTheme=index;
 }
 else{
   if(themeStateInMemory.head!=null)
   {
     headThemeChanger(themeStateInMemory.head);
   }
   if(themeStateInMemory.body!=null)
   {
     bodyThemeChanger(themeStateInMemory.body);
   }
   }
 }
 
for(var i=0;i<themeSelect.length;i++)
{
  themeSelect[i].addEventListener('click',function(e){
    var themeNumber=Number(e.target.value);
    themeChanger(themeNumber);
 });
}
// themeSelect.forEach(function(item){
// item.addEventListener('click',function(e){
// var themeNumber=Number(e.target.value);
// themeChanger(themeNumber);
//   });
// });
function themeChanger(index)
{
  var headTheme= themeArray[index].head;
  var bodyTheme=themeArray[index].body;
  root.style.setProperty("--ThemeHead",headTheme);   
  root.style.setProperty("--ThemeBody",bodyTheme);
  savingTheme=index;
  HeadColor=headTheme;
  BodyColor=bodyTheme;
}








/*var activeTheme="def";
for(var i=0 ; i<themeSelect.length ; i++)
{
themeSelect[i].addEventListener("click",(e)=>{
    // removeTheme(activeTheme,0);
    
    removeRoot();
    var value= e.target.value;
    console.log(value);
    document.documentElement.setAttribute("themes",value);
     bodyColorWindow.style.backgroundImage="linear-gradient(to top right , violet , indigo , blue , green , yellow , orange , red)";
    headerColorWindow.style.backgroundImage="linear-gradient(to top right , violet , indigo , blue , green , yellow , orange , red)";
    
    activeTheme=value;
   
});
}
function removeRoot(){
  var r = document.querySelector(":root");
     r.style.removeProperty("--ThemeHead");
     r.style.removeProperty("--ThemeBody");
}*/


headerColor.addEventListener("input",()=>{
 /*console.log(headerColor.value);
// console.log(activeTheme);
// document.documentElement.setAttribute("themes",activeTheme);
 var h= document.querySelector("[themes="+activeTheme+"]");
 h.style.setProperty("--ThemeHead" ,"linear-gradient(to right , "+headerColor.value +","+headerColor.value+")");
 headerColorWindow.style.backgroundImage="linear-gradient(to right ,"+headerColor.value+","+headerColor.value+")";
 */
 var color= headerColor.value;
 headThemeChanger(color);
  
});

function headThemeChanger(color){
  root.style.setProperty("--ThemeHead","linear-gradient(to right,"+color+","+color+")");
 headerColorWindow.style.backgroundImage=
 "linear-gradient(to right,"+color+","+color+")";
 HeadColor=color;
 savingTheme=-1;
}


bodyColor.addEventListener("input",()=>{
 /* document.documentElement.setAttribute("themes",activeTheme);
var b= document.querySelector("[themes="+activeTheme+"]");
 b.style.setProperty("--ThemeBody" ,"linear-gradient(to right , "+bodyColor.value +","+bodyColor.value+")");
  bodyColorWindow.style.backgroundImage="linear-gradient(to right ,"+bodyColor.value+","+bodyColor.value+")";
 */
 var color= bodyColor.value;
 
});

function bodyThemeChanger(color)
{
root.style.setProperty("--ThemeBody","linear-gradient(to right,"+color+","+color+")");
 bodyColorWindow.style.backgroundImage=
 "linear-gradient(to right,"+color+","+color+")";
 savingTheme=-1;
 BodyColor=color;
}

var themeset=document.getElementById("themeset");
var themereset=document.getElementById("themereset");
themeset.addEventListener("click",()=>
{
  popupClose(popupOpen);
 var saveThemeObj={ index:String(savingTheme), head:HeadColor,body:BodyColor};
 window.localStorage.setItem("themeState",JSON.stringify(saveThemeObj));
});

themereset.addEventListener("click",()=>{
  
 /* var h= document.querySelector("[themes="+activeTheme+"]");
 h.style.removeProperty("--ThemeHead");
 var b= document.querySelector("[themes="+activeTheme+"]");
 b.style.removeProperty("--ThemeBody");
 document.documentElement.setAttribute("themes","def");*/
  bodyColorWindow.style.backgroundImage="linear-gradient(to top right , violet , indigo , blue , green , yellow , orange , red)";
  headerColorWindow.style.backgroundImage="linear-gradient(to top right , violet , indigo , blue , green , yellow , orange , red)";
  // activeTheme="def";
   toggleWhiteText();
   console.log("Checking is dark "+window.localStorage.getItem('isDark'));
  // if(window.localStorage.getItem("isDark")=="1"){
    // root.style.setProperty("--ThemeBody","url('/ChatDark1.png')");
   //}else{
   root.style.setProperty("--ThemeBody",themeArray[0].body);
  // }
   root.style.setProperty("--ThemeHead",themeArray[0].head);
   savingTheme=-1;
   HeadColor=null;
   BodyColor=null;
   var saveThemeObj={ index:String(savingTheme), head:HeadColor,body:BodyColor};
 window.localStorage.setItem("themeState",JSON.stringify(saveThemeObj));
});

onlineBtn.addEventListener('click',()=>{
 
  popupClose(popupOpen);
  onlineShow.classList.add('open');
  document.getElementById('onid').classList.toggle('transition');
});


dotInChat.addEventListener("click",()=>{
  popupClose(popupOpen);
  showSettingsMenu.classList.add("open");
});

chatThemeSettingsView.addEventListener("click",()=>{
  popupClose(popupOpen);
  showTheme.classList.add('open');
});


headerTextWhite.addEventListener('click',toggleWhiteText);
function toggleWhiteText(){
  document.getElementById('switchball').classList.toggle('toggle-ball-switch');
  type.classList.toggle('whiteText');
}


var blockerClick=document.getElementsByClassName('blocker');
for(var i=0; i< blockerClick.length ;i++)
{
  blockerClick[i].addEventListener('click',(e)=>{
    e.target.parentNode.classList.remove('open');
  });
}


function popupClose(x){
// x.forEach(popClose);
  for(var i=0;i<x.length;i++)
  {
    popClose(x[i]);
 }
}
function popClose(item){
  item.classList.remove('open');
}

  



















//Initialising all variables
const uname=window.localStorage.getItem("uname");
let sendbtn=document.getElementById("SendText");
let TextInp=document.getElementById('InpText');
let messageContainer=document.querySelector(".chatarea");
let bodyfix=document.getElementById("bodyfix");
let onlineBox=document.getElementById('onlinelist');
var a= document.getElementById("onid");
const audio_send=new Audio('/Send.mp3');
const audio_recieve=new Audio('/Recieve.mp3');
var flag=true;




var iterate=1;
var msgid=0;

//EventListener for Dom loading
document.addEventListener("DOMContentLoaded", function LoadMsg(){
  
 
  console.log("We are here inside LoadMsg");
  console.log("Sending request");
  socket.emit('new-user-joined',uname,(initFetch)=>
  {
    console.log(initFetch);
    if(initFetch===1)
    {
//       var id= setTimeout(function() {
//         document.location.reload();
//       },4000);
     socket.emit("FetchMsg",msgid,function onFetch(MsgJson){
       if(!userCount>0){
         var typeJson= typeof MsgJson;
         console.log("Typeof MsgJson is "+typeJson)
         if(typeJson=="string"){
//            clearTimeout(id);
    userCount++;   
    console.log("Msg recieved from server");
    console.log(MsgJson);
    const ParseMsgJson= JSON.parse(MsgJson);
    
    var prevMsgs= ParseMsgJson.rows;
    console.log(prevMsgs);
   prevMsgs.forEach(printMsg);
    
   fetchcount=prevMsgs.length;
   console.log("Fetchcount is 30 onload",fetchcount);
   isFetched=1;
   messageContainer.scrollTop=messageContainer.scrollHeight;
       }
       }  
       
     });
    }
  });
});
  



//function to print Server PreviousMsgs
function printMsg(item){
      var pos;
      var chatnum=item.chatno;
      if(chatnum==1)
      {
        messageContainer.removeEventListener("scroll",ScrollFetch);
      }
      if(item.sender==window.localStorage.getItem("uname"))
      {
        pos='right';
        append(item.msg,pos,1);
       
      }
      else{
        pos='left';
        append_recieve(item.msg,pos,item.sender,1)
      }
    }

//Appending Previous chats from server
function append(message,position,flag)
{
  msgid++;
  const messageElement=document.createElement('div');
  
 var msgNode=document.createTextNode(message);
 messageElement.append(msgNode);
 messageElement.classList.add('message');
 messageElement.classList.add(position);
 
 if(flag===0)
 {
   messageContainer.appendChild(messageElement);
   audio_send.play();
   messageContainer.scrollTop=messageContainer.scrollHeight;
   TextInp.focus();
 }
 else if(flag===1)
 {
  messageElement.setAttribute('id',String(msgid));
     console.log("id added "+message+ "is"+msgid+" in"+flag);
   messageContainer.insertBefore(messageElement,messageContainer.childNodes[0]);
   
 }
}

function append_recieve(message , position,Sendername,flag)
{
  msgid++;
 const messageElement=document.createElement('div');
 const sendername=document.createElement('p');
 const msg=document.createElement('p');
 var msgNode=document.createTextNode(message);
 var senderStreak=document.createTextNode(Sendername);
 msg.appendChild(msgNode);
 sendername.appendChild(senderStreak);
 sendername.classList.add('msgstreakscore');
 sendername.style.color=random_hex_color_code();
 messageElement.appendChild(sendername);
  messageElement.appendChild(msg);
 messageElement.classList.add('message');
 messageElement.classList.add(position);
 
 
 if(flag===0)
 {
   messageContainer.appendChild(messageElement);
   messageContainer.scrollTop=messageContainer.scrollHeight;
   audio_recieve.play();
   TextInp.focus();
 }
 else if(flag===1){
   messageElement.setAttribute('id',String(msgid));
     console.log("id added to"+message+"is "+msgid+" in"+flag);
   messageContainer.insertBefore(messageElement,messageContainer.childNodes[0]);
 }
}


//Random hex cide generator
const random_hex_color_code = () => {
 
  var randomColor=['#ff4646', '#0086a7', '#0aa100','#4700ff' ,'#ff09cf ','#ff6300'];
  var randomColorNo= Math.floor(Math.random()*(5-0+1)+0);
  return randomColor[randomColorNo];
};



//Send Button function
sendbtn.addEventListener('click',(event)=>{
  
  event.preventDefault();
  //typerup();
  const message=TextInp.value;
  if(message=="")
  {
    TextInp.focus();
    return;
  }
  append(`${message}`,'right',0);
  TextInp.value="";
  TextInp.focus();
  socket.emit('send',uname,message);
  
});






//Logo fixing on input focus
TextInp.addEventListener('focus',(event)=>{
  console.log("Focused and changed");
 
document.getElementById("logofix").classList.remove("logoimg");
document.getElementById("logofix").classList.add("Logofix");
//document.getElementById("pfix").classList.add("Pfix");
});

TextInp.addEventListener("blur",(event)=>{

document.getElementById("logofix").classList.remove("Logofix");
document.getElementById("logofix").classList.add("logoimg");
//document.getElementById("pfix").classList.remove("Pfix");
});


onlineBtn.addEventListener("click",()=>{socket.emit("online",(users)=>{console.log(users);addOnlineUser(users))}});
//Display online users 
function addOnlineUser(actvuser)
{
  console.log("Actvusers is "+actvuser);
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
      console.log("Adding user is "+item);
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




//Typer functions 
TextInp.addEventListener('input',()=>{
  socket.emit('typers',uname);
});








//Typing information
socket.on("typerslist",(typers)=>{
  console.log("before removing uname "+typers);
  if(typers.includes(uname))
  {
    var index= typers.indexOf(uname)
    typers.splice(index,1);
  }
  console.log("After removing uname "+typers);
  var len=typers.length;
  let str= typers.join(", ");
  let str1="";
  if(len===0)
  {
    document.getElementById("typerstring").innerText="";
  }
  else if(len===1)
  {
  str1 =str1.concat(str, " is typing");
  }
  else if(len===2)
  {
   str1=str1.concat(str," are typing");
  }
  else if(len>2)
  {
    str1=str1.concat(typers[0],", "+typers[1]+" and"+(len-2)+" others are typing");
  }
  //console.log(str1);
  document.getElementById("typerstring").innerText=str1;
  
});





//socket functions 

/*socket.on('user-joined',name=>{
  
  //append(`${name} joined`,'center',0);
});*/

//socket.on('online',activeUsers=>{
//   console.log('List recieved is '+activeUsers);
//   addOnlineUser(activeUsers);
//       });
      
// socket.on("ionline",activeUsers=>{
//   console.log('List recieved is '+activeUsers);
//   addOnlineUser(activeUsers);
// });

socket.on('recieve',data=>{
  append_recieve(`${data.message}`,'left',`${data.name}`,0)
});






//Push msg when user leaves
socket.on('left',name=>{
  if(name==null||undefined)
  {
  //  socket.emit('removenull');
  }
 else{ 
   //append(`${name} left`,'center',0);
   console.log("Removed user is "+name);
   removeOnlineUser(name);
}
});




//Appending messages when user scrolls
messageContainer.addEventListener("scroll",ScrollFetch);
function ScrollFetch()
{
  if(messageContainer.scrollTop==0)
  {
    console.log("Here Scroll Top got 0");
//     var id=setTimeout(function() {
//       document.location.reload();
//     }, 4000);
    socket.emit("FetchMsg",msgid,function onFetch(MsgJson){
    var typeofMsgJson= typeof MsgJson;
    if(typeofMsgJson=="string")
    {
//       clearTimeout(id);
    console.log("Msg recieved from server");
    console.log(MsgJson);
    const ParseMsgJson= JSON.parse(MsgJson);
    var prevMsgs= ParseMsgJson.rows;
    console.log(prevMsgs.length);
    if(prevMsgs.length==0)
    {
      //Do nothing
    }
    else
    {
    prevMsgs.forEach(printMsg);
    console.log("Function returned");
  
    document.getElementById(String(50*iterate)).scrollIntoView();
    iterate++;
    }
    }
  });
  }
}
