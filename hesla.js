const url = require("url");
const fs = require("fs");
const crypto = require("crypto");
const tokenMs = require('./uzivatelems.js').tokenMS;

const SOUBOR_hesla = "hesla.json";
//Checking the crypto module
const algorithm = 'aes-256-cbc'; //Using AES encryption
const key = Buffer.from('c215e7b166d6efadb477f636ae1572082fd8cc7fc71e580b7338ae120db4082b', 'hex');
const iv = Buffer.from('bee52f2d1ef6a0d779b88753d7b3518f', 'hex');

//Encrypting text
function encrypt(text) {
   let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
   let encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()]);
   return encrypted.toString('hex');
}

// Decrypting text
function decrypt(text) {
   //let iv = Buffer.from(text.iv, 'hex');
   let encryptedText = Buffer.from(text, 'hex');
   let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}

let hesla = []; //deklarace globalni promenne typu pole


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
    let fhesla = hesla; //zasifrovana hesla
    for(let ho of fhesla){
      ho.heslo = encrypt(ho.heslo);
    }

    let h = {};
    h.nazev = parametry.nazev; 
    h.jmeno = parametry.jmeno;
    h.id = parametry.id;
    h.heslo = encrypt(parametry.heslo);
    fhesla.push(h);

    //ulozeni seznamu zprav do souboru
    fs.writeFileSync(SOUBOR_hesla, JSON.stringify(fhesla, null, 2));

    //odpoved
    vistup.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "ok";
    vistup.end(JSON.stringify(o));
  } else if (vstup.url.startsWith("/heslam/nacti")) {
    let fhesla = [];
    if (fs.existsSync(SOUBOR_hesla)) {
      fhesla = JSON.parse(fs.readFileSync(SOUBOR_hesla));
      hesla = fhesla;
      for(let ho of hesla){
        ho.heslo = decrypt(ho.heslo);
      }
    }
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