var dark_toggle=document.getElementById("switch");
var switch_ball=document.getElementById("switchball");

dark_toggle.addEventListener("click",()=>{
  currentTheme=document.documentElement.getAttribute('theme');
  console.log("Curent theme is" + currentTheme);
  
  if(currentTheme=="light"){
    document.documentElement.setAttribute('theme','dark');
    switch_ball.classList.add("toggle-ball-switch");
    window.localStorage.setItem("isDark","1");
  }
  else{
    document.documentElement.setAttribute('theme','light');
    switch_ball.classList.remove("toggle-ball-switch");
    window.localStorage.setItem("isDark","0");
  }

});




function toggleSwitchRight(){
  switch_ball.classList.add("toggle-ball-switch");
}
function toggleSwitchLeft(){
  switch_ball.classList.remove("toggle-ball-switch");
}

function setTheme(theme)
{
document.documentElement.setAttribute("theme", theme);
}

function storeTheme(value)
{
window.localStorage.setItem("isDark",value);
}


document.addEventListener("DOMContentLoaded",()=>{
  
 const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  console.log("Match",prefersDarkScheme.matches);
  if(prefersDarkScheme.matches){
  switch_ball.classList.add("toggle-ball-switch");
  document.documentElement.setAttribute("theme", "dark");
    }
    else{
      switch_ball.classList.remove("toggle-ball-switch");
      document.documentElement.setAttribute("theme", "light");
    }
   preferTheme=window.localStorage.getItem("isDark")
   console.log("isDark"+preferTheme);
   if(preferTheme==null||preferTheme==undefined)
   {
     console.log("theme in storage is null");
   }
   else if(preferTheme=="1")
   {
     document.documentElement.setAttribute("theme", "dark");
     switch_ball.classList.add("toggle-ball-switch");
   }
   else{
     document.documentElement.setAttribute("theme", "light");
     switch_ball.classList.remove("toggle-ball-switch");
     
   }
  

  });

