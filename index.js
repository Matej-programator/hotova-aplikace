// inporty
const url = require("url");
const http = require("http");
const fs = require("fs");

// tvorda soboru.json
const ulozHeslo = require("./hesla.js").server;
const uzivatelems = require('./uzivatelems.js').server;

// promenim

let serverms = http.createServer(server);
let port = 7070;

// soubory na servu

let html = fs.readFileSync("./index.html");
let js = fs.readFileSync("./script.js");
let Klic = fs.readFileSync("./Klic.jpg");


// funce na servu
function server(vstup,vistup){
    console.log( "metoda3",vstup.method ); 

if(vstup.method == "POST"){
   console.log( "metoda4",vstup.method ); 
   let data = "";
vstup.on('data', function (kusDat) {                       
  data += kusDat;                                              
})       
console.log( "data",data);                                                       
vstup.on('end', function () {                                                                             
  if (data) {                                                  
    let parametry = JSON.parse(data);                          
    console.log(parametry);  
console.log( "metoda6",vstup.method ); 
 if (vstup.url.startsWith("/heslam/uloz")){
   console.log("uloz Heslo");
   ulozHeslo(vstup,parametry,vistup);
} 
console.log( "metoda34",vstup.method ); 
if(vstup.url.startsWith("/uzvatelems/prihlasitSe")){
   console.log("prihlasit se");
   uzivatelems(vstup,parametry,vistup);
}

if (vstup.url.startsWith("/heslam/nacti")){
   console.log("uloz Heslo");
   ulozHeslo(vstup,parametry,vistup);
}
if(vstup.url.startsWith("/uzvatelems/registrovat")){
   console.log("registrovat");
   uzivatelems(vstup,parametry,vistup);
}



  } else {                                                     
                                     
  }                                                                                     
})                            

}

 if(vstup.url == "/"){
    vistup.writeHead(200,{"Content-type":"text/html"});
    html.toString();
    vistup.end(html);
 }
  
 if (vstup.url == "/script.js") {
    vistup.writeHead(200,{"Content-type": "application/javascript"});
    vistup.end(js);
}

if(vstup.url == "/favicon.ico"){
   vistup.writeHead(200,{"Content-type":"image/jpg"});
   vistup.end(Klic);
}

}
serverms.listen(port);
