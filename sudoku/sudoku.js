
// const grid = {
//     "00": {"etat": "initial", "valeur": 6},
//     "01": {"etat": "", "valeur": 8},
//     "02": {"etat": "", "valeur": 3},
//     "03": {"etat": "", "valeur": 7},
//     "04": {"etat": "initial", "valeur": 9},
//     "05": {"etat": "", "valeur": 1},
//     "06": {"etat": "", "valeur": 2},
//     "07": {"etat": "initial", "valeur": 4},
//     "08": {"etat": "initial", "valeur": 5},
//     "10": {"etat": "", "valeur": 9},
//     "11": {"etat": "", "valeur": 1},
//     "12": {"etat": "", "valeur": 5},
//     "13": {"etat": "", "valeur": 2},
//     "14": {"etat": "", "valeur": 4},
//     "15": {"etat": "initial", "valeur": 3},
//     "16": {"etat": "", "valeur": 6},
//     "17": {"etat": "", "valeur": 7},
//     "18": {"etat": "", "valeur": 8},
//     "20": {"etat": "initial", "valeur": 4},
//     "21": {"etat": "initial", "valeur": 2},
//     "22": {"etat": "initial", "valeur": 7},
//     "23": {"etat": "", "valeur": 8},
//     "24": {"etat": "", "valeur": 6},
//     "25": {"etat": "", "valeur": 5},
//     "26": {"etat": "", "valeur": 9},
//     "27": {"etat": "", "valeur": 3},
//     "28": {"etat": "initial", "valeur": 1},
//     "30": {"etat": "", "valeur": 1},
//     "31": {"etat": "initial", "valeur": 3},
//     "32": {"etat": "initial", "valeur": 2},
//     "33": {"etat": "initial", "valeur": 5},
//     "34": {"etat": "", "valeur": 8},
//     "35": {"etat": "", "valeur": 6},
//     "36": {"etat": "", "valeur": 4},
//     "37": {"etat": "initial", "valeur": 9},
//     "38": {"etat": "initial", "valeur": 7},
//     "40": {"etat": "", "valeur": 7},
//     "41": {"etat": "", "valeur": 6},
//     "42": {"etat": "", "valeur": 4},
//     "43": {"etat": "", "valeur": 9},
//     "44": {"etat": "initial", "valeur": 1},
//     "45": {"etat": "initial", "valeur": 2},
//     "46": {"etat": "", "valeur": 5},
//     "47": {"etat": "", "valeur": 8},
//     "48": {"etat": "initial", "valeur": 3},
//     "50": {"etat": "initial", "valeur": 5},
//     "51": {"etat": "", "valeur": 9},
//     "52": {"etat": "", "valeur": 8},
//     "53": {"etat": "", "valeur": 4},
//     "54": {"etat": "", "valeur": 3},
//     "55": {"etat": "", "valeur": 7},
//     "56": {"etat": "", "valeur": 1},
//     "57": {"etat": "initial", "valeur": 2},
//     "58": {"etat": "", "valeur": 6},
//     "60": {"etat": "", "valeur": 3},
//     "61": {"etat": "initial", "valeur": 4},
//     "62": {"etat": "initial", "valeur": 9},
//     "63": {"etat": "", "valeur": 1},
//     "64": {"etat": "initial", "valeur": 5},
//     "65": {"etat": "initial", "valeur": 8},
//     "66": {"etat": "initial", "valeur": 7},
//     "67": {"etat": "", "valeur": 6},
//     "68": {"etat": "", "valeur": 2},
//     "70": {"etat": "", "valeur": 8},
//     "71": {"etat": "initial", "valeur": 7},
//     "72": {"etat": "", "valeur": 1},
//     "73": {"etat": "initial", "valeur": 6},
//     "74": {"etat": "initial", "valeur": 2},
//     "75": {"etat": "initial", "valeur": 9},
//     "76": {"etat": "", "valeur": 3},
//     "77": {"etat": "", "valeur": 4},
//     "78": {"etat": "", "valeur": 5},
//     "80": {"etat": "", "valeur": 2},
//     "81": {"etat": "", "valeur": 5},
//     "82": {"etat": "", "valeur": 6},
//     "83": {"etat": "", "valeur": 3},
//     "84": {"etat": "initial", "valeur": 7},
//     "85": {"etat": "", "valeur": 4},
//     "86": {"etat": "", "valeur": 8},
//     "87": {"etat": "initial", "valeur": 1},
//     "88": {"etat": "", "valeur": 9}
// };

let partiePerdu;
let partieFinie;
let noteActive;
let isPaused;
let timer;
let elapsedTime;
let isRunning;
let grid;
let tempCase;
let joueur;
let adresseMail = {
    "Arthur": "arthur.mgnr@gmail.com",
    "Estelle": "arthur.mgnr@gmail.com"
    // "Estelle": "monvoisin.estelle3@gmail.com"
};
// let vetementsArthur = [];
// let vetementsEstelle = [];

window.onload = function() {
    document.querySelector(".content").classList.add("hidden");
    document.querySelector(".perdu").classList.add("hidden");
    document.querySelector(".gagne").classList.add("hidden");

    // document.querySelector(".note").classList.add("note-desactive");
    // document.querySelector(".note").textContent = "OFF";
};

function clickedCase(currentCase = null) {
    if (!partieFinie && isRunning) {
        const currentLigne = currentCase.getAttribute("ligne");
        const currentColonne = currentCase.getAttribute("colonne");
        const currentCarre = currentCase.getAttribute("carre");
        const cellules = document.querySelectorAll("td");
        cellules.forEach(cellule => {
            cellule.classList.remove("case-active");
            cellule.classList.remove("case-meme-ligne-colonne-carre");
            cellule.classList.remove("case-meme-chiffre");
            const celluleLigne = cellule.getAttribute("ligne");
            const celluleColonne = cellule.getAttribute("colonne");
            const celluleCarre = cellule.getAttribute("carre");
            if (currentLigne == celluleLigne && currentColonne == celluleColonne) {
                cellule.classList.add("case-active");
            }
            else if (currentLigne == celluleLigne || currentColonne == celluleColonne || currentCarre == celluleCarre) {
                cellule.classList.add("case-meme-ligne-colonne-carre");
            }
            else if (cellule.textContent.length != 0 && currentCase.textContent == cellule.textContent) {
                cellule.classList.add("case-meme-chiffre");
            }
        });
    } else {
        const cellules = document.querySelectorAll("td");
        cellules.forEach(cellule => {
            cellule.classList.remove("case-active");
            cellule.classList.remove("case-meme-ligne-colonne-carre");
            cellule.classList.remove("case-meme-chiffre");
        });
    }
};

function ecrireChiffre(valeur) {
    if (!partieFinie) {
        const caseActive = document.querySelector(".case-active");
        caseActive.classList.remove("erreur");
        const ligne = caseActive.getAttribute("ligne");
        const colonne = caseActive.getAttribute("colonne");
        if (grid[ligne + colonne]["etat"] != "initial") {
            if (valeur != grid[ligne + colonne]["valeur"]) {
                caseActive.classList.add("erreur");
                caseActive.textContent = valeur;
                setTimeout(() => {
                    caseActive.classList.remove("erreur");
                    caseActive.textContent = "";
                }, 1000);

                document.querySelector(".erreurs").textContent = parseInt(document.querySelector(".erreurs").textContent) + 1;

                if (document.querySelector(".erreurs").textContent == "3") {
                    partiePerdu = true;
                    finPartie();
                }
            } else {
                caseActive.textContent = valeur;
                grid[ligne + colonne]["etat"] = "initial";
            }
        }
        isPartieFinie();
    }
};

function finPartie() {
    stopTimer();
    document.querySelector(".play").classList.remove("hidden");
    document.querySelector(".pause").classList.add("hidden");
    if (partieFinie) {
        document.querySelector(".gagne").classList.remove("hidden");

        const minutes = Math.floor(elapsedTime / 60);
        const displaySeconds = elapsedTime % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(displaySeconds).padStart(2, '0');
        document.querySelector(".temps-final").textContent = `${formattedMinutes}:${formattedSeconds}`;
        
        let messageContent = `${joueur} a gagné !`;

        let nbVetements;
        if (joueur == "Arthur") {
            nbVetements = Math.min(5, Math.floor(elapsedTime/50));
            messageContent += "\n\nVêtements :";
            switch (nbVetements) {
                case 0:
                    messageContent += `\n${joueur}, tu ne dois pas enfiler de vêtements.`;
                    break;
                case 1:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite.`;
                    break;
                case 2:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite et Chaussette gauche.`;
                    break;
                case 3:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite, Chaussette gauche et Culotte.`;
                    break;
                case 4:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite, Chaussette gauche, Culotte et Soutien-gorge.`;
                    break;
                case 5:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite, Chaussette gauche, Culotte, Soutien-gorge et Pantalon.`;
                    break;
                case 6:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite, Chaussette gauche, Culotte, Soutien-gorge, Pantalon et T-Shirt.`;
                    break;
            }
        } else {
            nbVetements = Math.min(5, Math.floor(elapsedTime/60));
            messageContent += "\n\nVêtements :";
            switch (nbVetements) {
                case 0:
                    messageContent += `\n${joueur}, tu ne dois pas enfiler de vêtements.`;
                    break;
                case 1:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite.`;
                    break;
                case 2:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite et Chaussette gauche.`;
                    break;
                case 3:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite, Chaussette gauche et Caleçon.`;
                    break;
                case 4:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite, Chaussette gauche, Caleçon et Pantalon.`;
                    break;
                case 5:
                    messageContent += `\n${joueur}, tu dois enfiler : Chaussette droite, Chaussette gauche, Caleçon, Pantalon et T-Shirt.`;
                    break;
            }
        }

        document.querySelector(".nb-vetements").textContent = nbVetements;
        if (nbVetements == 0 || nbVetements == 1) {
            document.querySelector(".span-vetements").textContent = "vêtement";
        } else {
            document.querySelector(".span-vetements").textContent = "vêtements";
        }

        const nbErreurs = parseInt(document.querySelector(".erreurs").textContent);
        document.querySelector(".nb-erreurs-1").textContent = nbErreurs;
        document.querySelector(".nb-erreurs-2").textContent = nbErreurs;
        switch (nbErreurs) {
            case 0:
                document.querySelector(".span-gage-gagne").textContent = "gage";
                messageContent += `\n\nErreurs :\n${joueur} n'a fait aucune erreur et n'a donc pas de gages.`;
                break;
            case 1:
                document.querySelector(".span-gage-gagne").textContent = "gage";
                messageContent += `\n\nErreurs :\n${joueur} a fait 1 erreur et a donc 1 gage :`;
                break;
            case 2:
                document.querySelector(".span-gage-gagne").textContent = "gages";
                messageContent += `\n\nErreurs :\n${joueur} a fait 2 erreurs et a donc 2 gages :`;
                break;
        }


        if (nbErreurs == 0) {
            document.querySelector(".p-gages").classList.remove("hidden");
            document.querySelector(".p-gages").textContent = "Pas de gage";
        } else {
            const ul = document.querySelector(".ul-gages");
            ul.classList.remove("hidden");
            const firstLi = document.createElement("li");
            let gage1 = `Pendant 5 min, ${joueur} doit garder ses vêtements !`;
            firstLi.textContent = gage1;
            ul.appendChild(firstLi);
            messageContent += "\n- " + gage1;
            if (nbErreurs == 2) {
                const secondLi = document.createElement("li");
                let gage2;
                if (joueur == "Arthur") {
                    gage2 = "Pendant 5 min, Arthur tu vas offrir un massage à Estelle. Tu peux masser toutes les parties de son corps. Estelle, tu peux proposer des parties de ton corps. Arthur, tu peux finir par un massage sensuel si tu veux.";
                } else {
                    gage2 = "Pendant 5 min, Estelle tu vas offrir un massage à Arthur. Tu peux masser toutes les parties de son corps. Arthur, tu peux proposer des parties de ton corps. Estelle, tu peux finir par un massage sensuel si tu veux.";
                }
                secondLi.textContent = gage2;
                ul.appendChild(secondLi);
                messageContent += "\n- " + gage2;
            }
        }

        document.querySelector(".autre-joueur-gagne").textContent = joueur == "Arthur" ? "Estelle" : "Arthur";
        envoieMail(messageContent);
        // console.log(messageContent);

    } else if (partiePerdu) {
        let autreJoueur = joueur == "Arthur" ? "Estelle" : "Arthur";
        let gage;
        if (joueur == "Arthur") {
            gage = "Pendant 10 min, Estelle pourra faire ce qu'elle veut de toi. Tu devras lui obéir au doigt et à l'oeil sans rien dire. Tu vas être son esclave sexuel pendant 10 min !";
        } else {
            gage = "Pendant 10 min, Arthur pourra faire ce qu'il veut de toi. Tu devras lui obéir au doigt et à l'oeil sans rien dire. Tu vas être son esclave sexuel pendant 10 min !";
        }
        document.querySelector(".perdu").classList.remove("hidden");
        // document.querySelector(".span-gage-perdu").textContent = "Tu vas devoir te laisser faire pendant 1 min, tu n'as le droit de rien toucher !";
        document.querySelector(".span-gage-perdu").textContent = gage;
        document.querySelector(".autre-joueur-perdu").textContent = autreJoueur;

        let messageContent = `${joueur} a perdu !\n\nVoici son gage :\n` + gage;
        envoieMail(messageContent);
        // console.log(messageContent);
    }
};

function envoieMail(messageContent) {
    var templateParams = {
        message: messageContent,
        from_name: joueur,
        email_adress: adresseMail[joueur]
    };

    emailjs.init({
        publicKey: 'MB1XiXbSaggvsrMwM'
    });

    emailjs.send('service_2w3lvbe', 'template_fxdu49m', templateParams).then(
        (response) => {
            console.log('SUCCESS!', response.status, response.text);
        },
        (error) => {
            console.log('FAILED...', error);
        },
    );
};

function isPartieFinie() {
    const cellules = document.querySelectorAll("td");
    var cpt = 0;
    cellules.forEach(cellule => {
        const ligne = cellule.getAttribute("ligne");
        const colonne = cellule.getAttribute("colonne");
        if (cellule.textContent == grid[ligne + colonne]["valeur"]) {
            cpt++;
        }
    });
    if (cpt == 81) {
        partieFinie = true;
        finPartie();
    }
};

function start() {
    document.querySelector(".content").classList.remove("hidden");
    document.querySelector(".start").classList.add("hidden");
    document.querySelector(".play").classList.add("hidden");
    document.querySelector(".p-gages").classList.add("hidden");
    document.querySelector(".ul-gages").classList.add("hidden");

    const tempJoueur = document.querySelector("#joueur").value;
    joueur = tempJoueur.charAt(0).toUpperCase() + tempJoueur.slice(1);

    partieFinie = false;
    partiePerdu = false;
    isPaused = false;

    elapsedTime = 0;
    isRunning = false;
    startTimer();

    const dimension = Math.floor(parseInt(document.querySelector(".content").offsetWidth) / 9);
    const cellules = document.querySelectorAll("td");
    var cpt = 0;
    cellules.forEach(cellule => {
        cellule.style.height = dimension + "px";
        cellule.style.width = dimension + "px";
    });

    setGrid();
    fillGrid();
};

function startTimer() {
    if (!isRunning) {
        timer = setInterval(() => {
            elapsedTime++;
            const minutes = Math.floor(elapsedTime / 60);
            const displaySeconds = elapsedTime % 60;
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(displaySeconds).padStart(2, '0');
            document.querySelector(".compteur").textContent = `${formattedMinutes}:${formattedSeconds}`;
        }, 1000);
        isRunning = true;
    }
};

function pauseTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
    }
};

function stopTimer() {
    clearInterval(timer);
    // elapsedTime = 0;
    isRunning = false;
};

function pause() {
    if (isPaused) {
        document.querySelector(".pause").classList.remove("hidden");
        document.querySelector(".play").classList.add("hidden");
        isPaused = false;
        startTimer();
        fillGrid();
        clickedCase(tempCase);
        document.querySelector("table").classList.remove("disabled");
        document.querySelector(".button-container").classList.remove("disabled");
    } else {
        document.querySelector(".play").classList.remove("hidden");
        document.querySelector(".pause").classList.add("hidden");
        isPaused = true;
        pauseTimer();
        tempCase = document.querySelector(".case-active");
        clearGrid();
        clickedCase(null);
        document.querySelector("table").classList.add("disabled");
        document.querySelector(".button-container").classList.add("disabled");
    }
};

function restart() {
    window.location.reload();
};

function setGrid() {
    // grid = {
    //     "00": {"etat": "initial", "valeur": 6},
    //     "01": {"etat": "initial", "valeur": 8},
    //     "02": {"etat": "initial", "valeur": 3},
    //     "03": {"etat": "initial", "valeur": 7},
    //     "04": {"etat": "initial", "valeur": 9},
    //     "05": {"etat": "initial", "valeur": 1},
    //     "06": {"etat": "initial", "valeur": 2},
    //     "07": {"etat": "initial", "valeur": 4},
    //     "08": {"etat": "initial", "valeur": 5},
    //     "10": {"etat": "initial", "valeur": 9},
    //     "11": {"etat": "initial", "valeur": 1},
    //     "12": {"etat": "initial", "valeur": 5},
    //     "13": {"etat": "initial", "valeur": 2},
    //     "14": {"etat": "initial", "valeur": 4},
    //     "15": {"etat": "initial", "valeur": 3},
    //     "16": {"etat": "initial", "valeur": 6},
    //     "17": {"etat": "initial", "valeur": 7},
    //     "18": {"etat": "initial", "valeur": 8},
    //     "20": {"etat": "initial", "valeur": 4},
    //     "21": {"etat": "initial", "valeur": 2},
    //     "22": {"etat": "initial", "valeur": 7},
    //     "23": {"etat": "initial", "valeur": 8},
    //     "24": {"etat": "initial", "valeur": 6},
    //     "25": {"etat": "initial", "valeur": 5},
    //     "26": {"etat": "initial", "valeur": 9},
    //     "27": {"etat": "initial", "valeur": 3},
    //     "28": {"etat": "initial", "valeur": 1},
    //     "30": {"etat": "initial", "valeur": 1},
    //     "31": {"etat": "initial", "valeur": 3},
    //     "32": {"etat": "initial", "valeur": 2},
    //     "33": {"etat": "initial", "valeur": 5},
    //     "34": {"etat": "initial", "valeur": 8},
    //     "35": {"etat": "initial", "valeur": 6},
    //     "36": {"etat": "initial", "valeur": 4},
    //     "37": {"etat": "initial", "valeur": 9},
    //     "38": {"etat": "initial", "valeur": 7},
    //     "40": {"etat": "initial", "valeur": 7},
    //     "41": {"etat": "initial", "valeur": 6},
    //     "42": {"etat": "initial", "valeur": 4},
    //     "43": {"etat": "initial", "valeur": 9},
    //     "44": {"etat": "initial", "valeur": 1},
    //     "45": {"etat": "initial", "valeur": 2},
    //     "46": {"etat": "initial", "valeur": 5},
    //     "47": {"etat": "initial", "valeur": 8},
    //     "48": {"etat": "initial", "valeur": 3},
    //     "50": {"etat": "initial", "valeur": 5},
    //     "51": {"etat": "initial", "valeur": 9},
    //     "52": {"etat": "initial", "valeur": 8},
    //     "53": {"etat": "initial", "valeur": 4},
    //     "54": {"etat": "initial", "valeur": 3},
    //     "55": {"etat": "initial", "valeur": 7},
    //     "56": {"etat": "initial", "valeur": 1},
    //     "57": {"etat": "initial", "valeur": 2},
    //     "58": {"etat": "initial", "valeur": 6},
    //     "60": {"etat": "initial", "valeur": 3},
    //     "61": {"etat": "initial", "valeur": 4},
    //     "62": {"etat": "initial", "valeur": 9},
    //     "63": {"etat": "initial", "valeur": 1},
    //     "64": {"etat": "initial", "valeur": 5},
    //     "65": {"etat": "initial", "valeur": 8},
    //     "66": {"etat": "initial", "valeur": 7},
    //     "67": {"etat": "initial", "valeur": 6},
    //     "68": {"etat": "initial", "valeur": 2},
    //     "70": {"etat": "initial", "valeur": 8},
    //     "71": {"etat": "initial", "valeur": 7},
    //     "72": {"etat": "initial", "valeur": 1},
    //     "73": {"etat": "initial", "valeur": 6},
    //     "74": {"etat": "initial", "valeur": 2},
    //     "75": {"etat": "initial", "valeur": 9},
    //     "76": {"etat": "initial", "valeur": 3},
    //     "77": {"etat": "initial", "valeur": 4},
    //     "78": {"etat": "initial", "valeur": 5},
    //     "80": {"etat": "initial", "valeur": 2},
    //     "81": {"etat": "initial", "valeur": 5},
    //     "82": {"etat": "initial", "valeur": 6},
    //     "83": {"etat": "initial", "valeur": 3},
    //     "84": {"etat": "initial", "valeur": 7},
    //     "85": {"etat": "initial", "valeur": 4},
    //     "86": {"etat": "initial", "valeur": 8},
    //     "87": {"etat": "initial", "valeur": 1},
    //     "88": {"etat": "", "valeur": 9}
    // };

    grid = {
        "00": {"etat": "initial", "valeur": 6},
        "01": {"etat": "", "valeur": 8},
        "02": {"etat": "", "valeur": 3},
        "03": {"etat": "", "valeur": 7},
        "04": {"etat": "initial", "valeur": 9},
        "05": {"etat": "", "valeur": 1},
        "06": {"etat": "", "valeur": 2},
        "07": {"etat": "initial", "valeur": 4},
        "08": {"etat": "initial", "valeur": 5},
        "10": {"etat": "", "valeur": 9},
        "11": {"etat": "", "valeur": 1},
        "12": {"etat": "", "valeur": 5},
        "13": {"etat": "", "valeur": 2},
        "14": {"etat": "", "valeur": 4},
        "15": {"etat": "initial", "valeur": 3},
        "16": {"etat": "", "valeur": 6},
        "17": {"etat": "", "valeur": 7},
        "18": {"etat": "", "valeur": 8},
        "20": {"etat": "initial", "valeur": 4},
        "21": {"etat": "initial", "valeur": 2},
        "22": {"etat": "initial", "valeur": 7},
        "23": {"etat": "", "valeur": 8},
        "24": {"etat": "", "valeur": 6},
        "25": {"etat": "", "valeur": 5},
        "26": {"etat": "", "valeur": 9},
        "27": {"etat": "", "valeur": 3},
        "28": {"etat": "initial", "valeur": 1},
        "30": {"etat": "", "valeur": 1},
        "31": {"etat": "initial", "valeur": 3},
        "32": {"etat": "initial", "valeur": 2},
        "33": {"etat": "initial", "valeur": 5},
        "34": {"etat": "", "valeur": 8},
        "35": {"etat": "", "valeur": 6},
        "36": {"etat": "", "valeur": 4},
        "37": {"etat": "initial", "valeur": 9},
        "38": {"etat": "initial", "valeur": 7},
        "40": {"etat": "", "valeur": 7},
        "41": {"etat": "", "valeur": 6},
        "42": {"etat": "", "valeur": 4},
        "43": {"etat": "", "valeur": 9},
        "44": {"etat": "initial", "valeur": 1},
        "45": {"etat": "initial", "valeur": 2},
        "46": {"etat": "", "valeur": 5},
        "47": {"etat": "", "valeur": 8},
        "48": {"etat": "initial", "valeur": 3},
        "50": {"etat": "initial", "valeur": 5},
        "51": {"etat": "", "valeur": 9},
        "52": {"etat": "", "valeur": 8},
        "53": {"etat": "", "valeur": 4},
        "54": {"etat": "", "valeur": 3},
        "55": {"etat": "", "valeur": 7},
        "56": {"etat": "", "valeur": 1},
        "57": {"etat": "initial", "valeur": 2},
        "58": {"etat": "", "valeur": 6},
        "60": {"etat": "", "valeur": 3},
        "61": {"etat": "initial", "valeur": 4},
        "62": {"etat": "initial", "valeur": 9},
        "63": {"etat": "", "valeur": 1},
        "64": {"etat": "initial", "valeur": 5},
        "65": {"etat": "initial", "valeur": 8},
        "66": {"etat": "initial", "valeur": 7},
        "67": {"etat": "", "valeur": 6},
        "68": {"etat": "", "valeur": 2},
        "70": {"etat": "", "valeur": 8},
        "71": {"etat": "initial", "valeur": 7},
        "72": {"etat": "", "valeur": 1},
        "73": {"etat": "initial", "valeur": 6},
        "74": {"etat": "initial", "valeur": 2},
        "75": {"etat": "initial", "valeur": 9},
        "76": {"etat": "", "valeur": 3},
        "77": {"etat": "", "valeur": 4},
        "78": {"etat": "", "valeur": 5},
        "80": {"etat": "", "valeur": 2},
        "81": {"etat": "", "valeur": 5},
        "82": {"etat": "", "valeur": 6},
        "83": {"etat": "", "valeur": 3},
        "84": {"etat": "initial", "valeur": 7},
        "85": {"etat": "", "valeur": 4},
        "86": {"etat": "", "valeur": 8},
        "87": {"etat": "initial", "valeur": 1},
        "88": {"etat": "", "valeur": 9}
    };
};

function fillGrid() {
    const cellules = document.querySelectorAll("td");
    cellules.forEach(cellule => {
        const ligne = cellule.getAttribute("ligne");
        const colonne = cellule.getAttribute("colonne");
        if (grid[ligne + colonne]["etat"] == "initial") {
            cellule.textContent = grid[ligne + colonne]["valeur"];
        }
        else {
            cellule.classList.add("chiffre-trouve");
        }
    });
};

function clearGrid() {
    const cellules = document.querySelectorAll("td");
    cellules.forEach(cellule => {
        cellule.textContent = "";
    });
};


// function effacerChiffre() {
//     const caseActive = document.querySelector(".case-active");
//     const ligne = caseActive.getAttribute("ligne");
//     const colonne = caseActive.getAttribute("colonne");
//     if (grid[ligne + colonne]["etat"] != "initial") {
//         caseActive.textContent = "";
//     }
// };

// function prendreNote() {
//     if (noteActive) {
//         document.querySelector(".note").classList.remove("note-active");
//         document.querySelector(".note").classList.add("note-desactive");
//         document.querySelector(".note").textContent = "OFF";
//         noteActive = false;
//     }
//     else {
//         document.querySelector(".note").classList.remove("note-desactive");
//         document.querySelector(".note").classList.add("note-active");
//         document.querySelector(".note").textContent = "ON";
//         noteActive = true;
//     }
// };
