const url = require("url");
const fs = require("fs");
const crypto = require("crypto");

const SOUBOR_generuj= "generujHesla.json";

let Gh = []; //deklarace globalni promenne typu pole
if (fs.existsSync(SOUBOR_generuj)) {
  Gh = JSON.parse(fs.readFileSync(SOUBOR_generuj));
}



function zhesvaniHesla(){
  let heslo = "";
  let kZahashovani = heslo + "$wcc3@2021=";
  return crypto.createHash("sha256").update(kZahashovani).digest('hex');
}


exports.server = function (vstup,pa,vistup) {
  console.log("reg1");
  if(vstup.method == "POST"){
    let data = "";
    vistup.on('data', function (kusDat) {                       
      data += kusDat;                                              
    })                                                             
    vistup.on('end', function () {                                                                             
      if (data) {                                                  
        let pa = JSON.parse(data);                          
        console.log(pa);  
      }
    })
  }
  



  if (vstup.url.startsWith("/hesla/generuj")) {
    //zpracovani parametru

    //pridani msU do seznamu zprav
    let G = {};
    G.generovat.pa = vh;
    Gh.push(G);
    console.log(Gh);

    //ulozeni seznamu zprav do souboru
    fs.writeFileSync(SOUBOR_generuj, JSON.stringify(Gh, null, 2));

    //odpoved
    vistup.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "ok";
    vistup.end(JSON.stringify(o));
  } else if (vstup.url.startsWith("/uzvatelems/prihlasitSe")) {
    console.log("prihlaseni");
    let parametry = url.parse(vstup.url, true).query;
    for(let Um of msU){
      if(Um.jmeno == parametry.jmenopr){
        
        if(Um.heslo == zhesvaniHesla(parametry.he)){

          let overovaniUzivatelu = crypto.randomBytes(11).toString("hex");
          Um.overovaniUzivatelu = overovaniUzivatelu;

          //odpoved
          vistup.writeHead(200, {"Content-type": "application/json"});
          let o = {};
          o.stav = "ok";
          o.overovaniUzivatelu = overovaniUzivatelu;
          o.jmeno = Um.jmeno;
          vistup.end(JSON.stringify(o));
          return;
        } 
      }
    }
           let o = {};
          o.stav = "chyba";
          o.chba = "špatné jmeno nebo heslo nebo uživatele nezam";
          vistup.end(JSON.stringify(o));
  } else { //not found
    vistup.writeHead(404);
    vistup.end();
  }
}

  exports.tokenMs = function(overovaniUzivatelu){
    for(let Um of msU){
      if(Um.tokenMs == overovaniUzivatelu){
        return true;
      }
    }
    return false;
}