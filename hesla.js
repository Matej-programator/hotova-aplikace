const url = require("url");
const fs = require("fs");
const crypto = require("crypto");
const tokenMs = require('./uzivatelems.js').tokenMS;

const SOUBOR_hesla = "hesla.json";

let hesla = []; //deklarace globalni promenne typu pole
if (fs.existsSync(SOUBOR_hesla)) {
  hesla = JSON.parse(fs.readFileSync(SOUBOR_hesla));
}

function zahesovatHeslo(){
  let hesloU = "";
  let kZahashovani = hesloU + "$wcc3@2021=";
  return crypto.createHash("sha256").update(kZahashovani).digest('hex');
}
exports.server = function (vstup,parametry,vistup) {
 console.log(tokenMs(parametry.token));
    if (!tokenMs(parametry.token)){
    vistup.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "chyba";
    o.chyba = "uživatele nemama v databazi";
    vistup.end(JSON.stringify(o));
     return;
    }

  if (vstup.url.startsWith("/heslam/ulozt")) {
    //zpracovani parametru

    //pridani hesla do seznamu zprav
    let h = {};
    h.nazev = parametry.nazev; 
    h.heslo = parametry.heslo;
    h.jmeno = parametry.jmeno;
    h.id = parametry.id;
    hesla.push(h);
    console.log("********hesla");
    console.log(hesla);

    //ulozeni seznamu zprav do souboru
    fs.writeFileSync(SOUBOR_hesla, JSON.stringify(hesla, null, 2));

    //odpoved
    vistup.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "ok";
    vistup.end(JSON.stringify(o));
  } else if (vstup.url.startsWith("/heslam/nacti")) {
    //odpoved
    vistup.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "ok";
    o.hesla = hesla;
    vistup.end(JSON.stringify(o));
  } else { //not found
    vistup.writeHead(404);
    vistup.end();
  }
}