async function poNacteni() {
  ukazPrihlaseni();
}

function nactiVygenerovanaHesla(){
  setInterval(vygenerovaneHeslo,2000);
}
async function uloztHesla(){
    let nazev = document.getElementById("naapt").value;
    let heslo = document.getElementById("heslo").value;
    let jmeno = document.getElementById("nu").value;

    //generovane id
    let id = Math.floor(Math.random() * 1000000);

    let nebezpeci = {};
    nebezpeci.nazev = nazev;
    nebezpeci.heslo = heslo
    nebezpeci.jmeno = jmeno;
    nebezpeci.id = id;
    nebezpeci.token = token;
   
    if(nazev,heslo,jmeno == ""){
      alert("neuložíne vaše úbaje do databáze protože jste nic ne zadaly");
      return;
    }

    // posilani na server ve formatu url
    let url = location.href + "heslam/ulozt";
    console.log(url);
    let re = await fetch(url,{method: "POST",body: JSON.stringify(nebezpeci)});
    let data = await re.json();
    console.log(data);
    alert("heslo je uložno v databazi");
    smazaniOBSEHU(nazev,heslo,jmeno);
    nacti
}

function smazaniOBSEHU(nazev,heslo,jmeno){
    nazev = document.getElementById("naapt").value = "";
    heslo = document.getElementById("heslo").value = "";
    jmeno = document.getElementById("nu").value = "";
}

let token;
let plnejmeno = '';
async function prihlasitSe(){
  let prijm = document.getElementById("jp").value;
  let priheslo = document.getElementById("jh").value;

  let nebezpeci = {};
  nebezpeci.jmenopr = prijm;
  nebezpeci.he = priheslo;


   // posilani na server ve formatu url
    let url = location.href + "uzvatelems/prihlasitSe";
    console.log(url);
    let re = await fetch(url,{method: "POST",body: JSON.stringify(nebezpeci)});
    let data = await re.json();
    console.log(data);

    if (data.stav != "ok") {
      alert(data.chyba);
    return;
    }

  token = data.token;
 
   setInterval(nacti,2000);
    ukazKomunikaci();
}

//token = data.token;

async function nacti(){
  // posilani na server ve formatu url
    let url = location.href + "heslam/nacti";
    let nebezpeci = {};
    nebezpeci.token = token;
    console.log(url);
    let re = await fetch(url,{method: "POST",body: JSON.stringify(nebezpeci)});
    let data = await re.json();
    console.log("nacti",data)

    let s ="<table><th>Jméno uživatele</th><th>Název aplikace</th><th>Heslo do aplikace</th><th>kopirovat heslo</th><th>kopírovat<br>jmeno uživtele</th>";
    let ss ="";
    for(let ho of data.hesla){
      ss = "<tr><td>" + ho.jmeno+"</td><td>"+ ho.nazev+ "</td><td>"+ho.heslo+"</td><td><button onclick= 'upravytHESLO(`"+ho.id+ "`,`" + ho.heslo +"`)'>upravit heslo</button></td><td><button onclick=' upravytJMENO(`" + ho.id +"`,`" + ho.jmeno +"`)'>kopírovat jméno</button></td></tr>" + ss 
    }
    s = s + ss + "</table>"
  
   document.getElementById("h").innerHTML = s;

}

async function registovat() {
  let ujm = document.getElementById("jmu").value;
  let upm = document.getElementById("pru").value;
  let uhe = document.getElementById("huz").value;
  let uheznovu = document.getElementById("hzn").value;

  let nebezpeci = {};
  nebezpeci.jmeno = ujm;
  nebezpeci.primeni = upm;
  nebezpeci.heslo = uhe;
  nebezpeci.hesloznovu = uheznovu;

  if (ujm == "") {
    alert("nemůžeme vás zaregistrovat protože není zadáno vaše jméno");
    return;
  }

  if (upm == "") {
    alert("nemůžeme vás zaregistrovat protože není zadáno vaše příjmení");
    return;
  }

  if (uhe == "") {
    alert("nemůžeme vás zaregistrovat protože není zadáno vaše heslo");
    return;
  }

  if (uheznovu != uhe) {
    alert("zadejte spravné heslo prosím");
    return;
  }

  // posilani na server ve formatu url
  let url = location.href + "uzvatelems/registrovat";
  console.log(url);
  let re = await fetch(url, { method: "POST", body: JSON.stringify(nebezpeci) });
  let data = await re.json();
  console.log(data);
  alert("právě jste se zaregistovali");
  ukazPrihlaseni();
}
 

// Generaror hesel

function generuj() {
  const kontejner = document.getElementById("vygenerovane-heslo");
  const delka = document.getElementById("delka-hesla").value;
  if (!delka) {
    alert("Heslo musí mít délku alespoň 1");
    return;
  }
  const heslo = generujHeslo(delka);
  kontejner.value = heslo;
  
}


function generujHeslo(delka) {
  const znaky = ziskejMozneZnaky(
    jeVybran("checkbox-mala"),
    jeVybran("checkbox-velka"),
    jeVybran("checkbox-cisla"),
    jeVybran("checkbox-specialni-znaky")
  );
  const charsetLength = znaky.length;
  if (charsetLength === 0) {
    alert("Je potřeba vybrat aspoň jeden typ znaku");
    return;
  }

  let password = "";
  const nahodnaCisla = crypto.getRandomValues(new Uint32Array(delka));

  for (let i = 0; i < delka; i++) {
    const randomIndex = nahodnaCisla[i] % charsetLength;
    password += znaky.charAt(randomIndex);
  }

  return password;
}

const znakyMala = "abcdefghijklmnopqrstuvwxyz";
const znakyVelka = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const znakyCisla = "0123456789";
const znakySpecialniZnaky = "!@#$%^&*()";

function ziskejMozneZnaky(mala, velka, cisla, specialniZnaky) {
  let vysledek = "";
  if (mala) {
    vysledek += znakyMala;
  }
  if (velka) {
    vysledek += znakyVelka;
  }
  if (cisla) {
    vysledek += znakyCisla;
  }
  if (specialniZnaky) {
    vysledek += znakySpecialniZnaky;
  }
  return vysledek;
}

function jeVybran(checkboxId) {
  return document.getElementById(checkboxId).checked;
}


function ukazPrihlaseni() {
  document.getElementById("oblast_registrace").style.display = "none";
  document.getElementById("oblast_prihlaseni").style.display = "block";
  document.getElementById("oblast_komunikace").style.display = "none";
  document.getElementById("hesla").style.display = "none";
    document.getElementById("ghe").style.display = "none";
}

function ukazRegistraci() {
  document.getElementById("oblast_registrace").style.display = "block";
  document.getElementById("oblast_prihlaseni").style.display = "none";
  document.getElementById("oblast_komunikace").style.display = "none";
  document.getElementById("hesla").style.display = "none";
  document.getElementById("ghe").style.display = "none";
}

function ukazKomunikaci() {
  document.getElementById("oblast_registrace").style.display = "none";
  document.getElementById("oblast_prihlaseni").style.display = "none";
  document.getElementById("oblast_komunikace").style.display = "block";
  document.getElementById("hesla").style.display = "block";
  document.getElementById("ghe").style.display = "none";
}

function ukazGeneratorHesel(){
  document.getElementById("oblast_registrace").style.display = "none";
  document.getElementById("oblast_prihlaseni").style.display = "none";
  document.getElementById("oblast_komunikace").style.display = "none";
  document.getElementById("hesla").style.display = "none";
  document.getElementById("ghe").style.display = "block";
}

function upravytHESLO(id,heslo){
  document.getElementById("idhesla").value = id;
  document.getElementById("heslo").value = heslo;
}

function upravytJMENO(id,jmeno){
  document.getElementById("idhesla").value = id;
  document.getElementById("nu").value = jmeno;
}
function ulozgeneraci(idh,kontejner){
  document.getElementById("heslo").value = idh
  document.getElementById("idhesla").value = kontejner;
}