const url = require("url");
const fs = require("fs");
const crypto = require("crypto");

const SOUBOR_msu= "msu.json";

let msU = []; //deklarace globalni promenne typu pole
if (fs.existsSync(SOUBOR_msu)) {
  msU = JSON.parse(fs.readFileSync(SOUBOR_msu));
}



function zhesvaniHesla(){
  let heslo = "";
  let kZahashovani = heslo + "$wcc3@2021=";
  return crypto.createHash("sha256").update(kZahashovani).digest('hex');
}


exports.server = function (vstup,parametry,vistup) {
  console.log("reg1");
  console.log(parametry);
/*  if(vstup.method == "POST"){
    let data = "";
    vistup.on('data', function (kusDat) {                       
      data += kusDat;                                              
    })                                                             
    vistup.on('end', function () {                                                                             
      if (data) {                                                  
        let parametry = JSON.parse(data);                          
        console.log("++++",parametry);  
      }
    })
  }*/
  



  if (vstup.url.startsWith("/uzvatelems/registrovat")) {
    //zpracovani parametru
  
     for (let u of msU) {
      if (u.prihlasovacijmeno == parametry.jmenom) {
        let o = {};
        o.stav = "chyba";
        o.chyba = "Uživatel existuje!";
        vistup.end(JSON.stringify(o));
        return;        
      }
    }
    //pridani msU do seznamu zprav
    let um = {};
    um.jmeno = parametry.jmeno; 
    um.primeni = parametry.primeni;
    um.heslo = zhesvaniHesla(parametry.heslo);
    um.hesloznovu = zhesvaniHesla(parametry.hesloznovu);
    msU.push(um);
    console.log(msU);

    //ulozeni seznamu zprav do souboru
    fs.writeFileSync(SOUBOR_msu, JSON.stringify(msU, null, 2));

    //odpoved
    vistup.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "ok";
    vistup.end(JSON.stringify(o));
  } else if (vstup.url.startsWith("/uzvatelems/prihlasitSe")) {
    console.log("prihlaseni");
    //let parametry = url.parse(vstup.url, true).query;
    for(let Um of msU){
      console.log(parametry);
      console.log(Um.jmeno,"-",parametry.jmenopr);
      console.log(Um.heslo,"-",parametry.he,"-",zhesvaniHesla(parametry.he));
      if(Um.jmeno == parametry.jmenopr){
        
        if(Um.heslo == zhesvaniHesla(parametry.he)){

          let token = crypto.randomBytes(11).toString("hex");
          Um.token = token;
           Um.platnostTokenuDo = Date.now() + 60 * 1000; //platnost tokenu vyprsi za minutu
          //odpoved
          vistup.writeHead(200, {"Content-type": "application/json"});
          let o = {};
          o.stav = "ok";
          o.token = token;
          o.jmeno = Um.jmeno;
          vistup.end(JSON.stringify(o));
          return;
        } 
      }
    }
           let o = {};
          o.stav = "chyba";
          o.chyba = "špatné jmeno nebo heslo nebo uživatele neznam";
          vistup.end(JSON.stringify(o));
         

  } else { //not found
    vistup.writeHead(404);
    vistup.end();
  }
}

exports.tokenMS = function(token){
  for (let u of msU) {
      if (u.token == token) {
        return true;        
      }
    } 
  return false;    
}