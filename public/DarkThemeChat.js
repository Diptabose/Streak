
 const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  if(prefersDarkScheme.matches){
  document.documentElement.setAttribute("theme", "dark");
    }
    else{
      document.documentElement.setAttribute("theme", "light");
    }
   preferTheme=window.localStorage.getItem("isDark")
   if(preferTheme==null||preferTheme==undefined)
   {
     //console.log("theme in storage is null");
   }
   else if(preferTheme=="1")
   {
     document.documentElement.setAttribute("theme", "dark");
   }
   else{
     document.documentElement.setAttribute("theme", "light");
   }
  
