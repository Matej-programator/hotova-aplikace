const url = require("url");
const fs = require("fs");
const crypto = require("crypto");
const id = require("generate-unique-id");
const tokenMs = require('./uzivatelems.js').tokenMS;

const SOUBOR_hesla = "generuj.json";


let generuj = []; //deklarace globalni promenne typu pole


function zahesovatHeslo(){
  let hesloU = "";
  let kZahashovani = hesloU + "$wcc3@2021=";
  return crypto.createHash("sha256").update(kZahashovani).digest('hex');
}

function generatorId(){
  return id({
    length:10,
    useLetters:false,
  })
}

exports.server = function (vstup,parametry,vistup) {
 console.log(tokenMs(parametry.token));

  if (vstup.url.startsWith("/heslam/generuj")) {
    //zpracovani parametru
    console.log(parametry);
    //pridani hesla do seznamu zprav
    let G = {};
    G.generovaneHESLO = parametry.generovat; 
    G.idGenerace = generatorId();
    generuj.push(G);

    //ulozeni seznamu zprav do souboru
    fs.writeFileSync(SOUBOR_hesla, JSON.stringify(generuj, null, 2));
      
    //odpoved
    vistup.writeHead(200, {"Content-type": "application/json"});
    let o = {};
    o.stav = "ok";
    vistup.end(JSON.stringify(o));

  } else if(vstup.url.startsWith("/heslam/generuj/nacti")){
    console.log("nacti");
    //odpoved
    vistup.writeHead(200, {"Content-type": "application/json"});
    let or = {};
    or.stav = "ok";
    generuj = JSON.parse(fs.readFileSync(SOUBOR_hesla));
    or.generuj = generuj;
    or.id = generatorId();
    vistup.end(JSON.stringify(o));
  }
}