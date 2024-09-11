
function getNumeroSemaine(date) {
    const debutAnnee = new Date(date.getFullYear(), 0, 1);
    const jourAnnee = Math.floor((date - debutAnnee) / (24 * 60 * 60 * 1000)) + 1;
    const numeroSemaine = Math.ceil(jourAnnee / 7);
    return numeroSemaine;
}

const aujourdHui = new Date();

// console.log(getNumeroSemaine(aujourdHui));
// console.log(aujourdHui.getDate());
// console.log(aujourdHui.getMonth() + 1);

const jsonlFilePath = 'edt.jsonl';

const jsonObjects = [];

fetch(jsonlFilePath)
    .then(response => {
    if (!response.ok) {
        throw new Error('Impossible de charger le fichier JSONL');
    }
    return response.text();
    })
    .then(data => {
    const lines = data.split('\n');

    lines.forEach((line, index) => {
        if (line.trim()) {
        try {
            const jsonObject = JSON.parse(line);
            jsonObjects.push(jsonObject);
        }
        catch (error) {
            
        }
        }
    });

    // console.log('Nb elts :', jsonObjects.length);
    
    })
    .catch(error => {
        console.error('Erreur:', error);
    });


// const checkbox = document.querySelector("label.switch > input");
// console.log("Etat initial :", checkbox.value);
// checkbox.addEventListener("change", function() {
//     if (checkbox.checked) {
//         console.log("Nouveau état : True");
//     } else {
//         console.log("Nouveau état : False");
//     }
// });

const edt = document.querySelector(".edt");
const edtCours = document.querySelector(".edt-cours");

// const edtHeight = edt.offsetHeight;
const edtHeight = parseFloat(window.getComputedStyle(edt).height);
const edtHeightMargin = parseFloat(window.getComputedStyle(edt).marginBottom);
const windowHeight = window.innerHeight;
const edtWidth = edt.offsetWidth;
const edtCoursWidth = edtCours.offsetWidth;
const edtCoursWidth2 = parseFloat(window.getComputedStyle(edtCours).width);

for (let i = 8; i < 21; i++) {
    const element = document.querySelector(`span[num="${i}"]`);
    element.style.transform = `translateY(${((edtHeight + edtHeightMargin - windowHeight / 50) / 12) * (i - 8) - 10}px)`;
    if (i != 8 && i != 20) {
        const border = document.createElement("div");
        border.style.position = "absolute";
        border.style.top = "50%";
        border.style.transform = `translateX(${edtWidth - edtCoursWidth}px)`;
        border.style.width = edtCoursWidth + "px";
        border.style.borderBottom = "solid 1px black";
        element.appendChild(border);
    }
}


const cours1 = document.querySelector("div[cours='1'");
let debut = 10;
let duree = 2;
let intitule = "MAACI1";
let prof = "MichelinLinares";
let salle = "G102";
let numero = "1/5";
cours1.style.height = edtHeight / 12 * duree - (duree - 1) + "px";
cours1.style.width = edtCoursWidth2 - 2 + "px";
cours1.style.position = "absolute";
cours1.style.top = (debut - 8) * edtHeight / 12 - (debut != 8 ? 1 : 0) + "px";
cours1.style.backgroundColor = "cornflowerblue";
cours1.style.display = "flex";
cours1.style.alignItems = "center";
cours1.style.flexDirection = "column";
cours1.style.justifyContent = "center";
cours1.style.zIndex = "2";
cours1.querySelector(".intitule").textContent = intitule;
cours1.querySelector(".prof").textContent = prof;
cours1.querySelector(".salle").textContent = salle;
cours1.querySelector(".numero").textContent = numero;

const cours2 = document.querySelector("div[cours='2'");
debut = 13;
duree = 2;
intitule = "MAACI1";
prof = "MichelinLinares";
salle = "G102";
numero = "1/5";
cours2.style.height = edtHeight / 12 * duree - (duree - 1) + "px";
cours2.style.width = edtCoursWidth2 - 2 + "px";
cours2.style.position = "absolute";
cours2.style.top = (debut - 8) * edtHeight / 12 - (debut != 8 ? 1 : 0) + "px";
cours2.style.backgroundColor = "cornflowerblue";
cours2.style.display = "flex";
cours2.style.alignItems = "center";
cours2.style.flexDirection = "column";
cours2.style.justifyContent = "center";
cours2.style.zIndex = "2";
cours2.querySelector(".intitule").textContent = intitule;
cours2.querySelector(".prof").textContent = prof;
cours2.querySelector(".salle").textContent = salle;
cours2.querySelector(".numero").textContent = numero;

