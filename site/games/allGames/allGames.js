
import { toggleResetFilter, sortGames } from "/site/components/common.js";
import { createFilterPrix } from "/site/components/filter-prix.js";
import { createFilterAge } from "/site/components/filter-age.js";
import { createFilterNbJoueurs } from "/site/components/filter-nbJoueurs.js";
import { createFilterDuree } from "/site/components/filter-duree.js";
import { createFilterEditeur } from "/site/components/filter-editeur.js";
import { createFilterCategories } from "/site/components/filter-categories.js";
import { createFilterPossede } from "/site/components/filter-possede.js";

// -------------------------------------------------------------------------------------

const gamesDiv = document.querySelector("#games-container");

// 71 jeux

// Filter Prix
const games_low_min = 7;
const games_low_max = 95;
let filterPrix = createFilterPrix(
    "prix", "Prix", "Prix :", games_low_min, games_low_max, () => { applyAllFilters(); }
);
filterPrix[0].updateSlider();
document.querySelector(".filter-headers").append(filterPrix[0]);
const cont = document.getElementById("filters-list");
cont.insertBefore(filterPrix[1], cont.children[cont.children.length - 1]);

// Filter Age
const games_low_age = ["6 et +", "8 et +", "9 et +", "10 et +", "12 et +", "14 et +", "16 et +", "18 et +"];
let filterAge = createFilterAge(
    "age", "Âge", "Âge minimum :", games_low_age, () => { applyAllFilters(); }
);
document.querySelector(".filter-headers").append(filterAge[0]);
cont.insertBefore(filterAge[1], cont.children[cont.children.length - 1]);

// Filter NbJoueurs
const games_low_nbJoueurs = ["1", "2", "2 et +", "3 et +", "4 et +", "5 et +", "6 et +", "7 et +", "8 et +", "9 et +", "10 et +"];
let filterNbJoueurs = createFilterNbJoueurs(
    "nbJoueurs", "Nombre de joueurs", "Nombre de joueurs :", games_low_nbJoueurs, () => { applyAllFilters(); }
);
document.querySelector(".filter-headers").append(filterNbJoueurs[0]);
cont.insertBefore(filterNbJoueurs[1], cont.children[cont.children.length - 1]);

// Filter Duree
const games_low_duree = ["15 min max", "15-30 min", "30-45 min", "45-60 min", "+ de 60 min"];
let filterDuree = createFilterDuree(
    "duree", "Durée", "Durée moyenne :", games_low_duree, () => { applyAllFilters(); }
);
document.querySelector(".filter-headers").append(filterDuree[0]);
cont.insertBefore(filterDuree[1], cont.children[cont.children.length - 1]);

// Filter Editeur
const games_low_editeur = ["Asmodée", "Blackrock Games", "Blue Orange", "Bombyx", "Cocktail Games", "Days of Wonder", "Don't Panic Games",
    "Dujardin", "Flip Flap Editions", "Flip Flap Éditions", "Gamewright", "Gigamic", "Grandpa Beck's Games", "Hasbro", "Helvetiq", "Hurrican",
    "Iello", "Libellud", "Lumberjacks Studio", "Magilano", "Matagot", "Mixlore", "Next Move", "OldChap Editions", "Oya", "Ravensburger",
    "Repos Production", "Schmidt Spiele GmbH", "Scorpion Masqué", "Smart Games", "Space Cowboys", "Spielwiese", "Studio H", "Z-Man Games"];
let filterEditeur = createFilterEditeur(
    "editeur", "Editeur", "Editeur :", games_low_editeur, () => { applyAllFilters(); }
);
document.querySelector(".filter-headers").append(filterEditeur[0]);
cont.insertBefore(filterEditeur[1], cont.children[cont.children.length - 1]);

// Filter Categorie
const games_low_categorie = ["Alignement", "Ambiance", "Association d'idées", "Aventure", "Bluff", "Cartes", "Casse-tête", "Chronologie",
    "Civilisation", "Code", "Collection", "Combinaison", "Communication", "Connaissance", "Construction", "Coopératif", "Crimes", "Culture générale",
    "Dextérité", "Draw & Write", "Déduction", "Dés", "Développement", "Educatif", "Enchères", "Enigme", "Enquête", "Escape Game", "Exploration",
    "Extension", "Familial", "Gestion de ressources", "Interprétation d'images", "Jeu de mots", "Logique", "Mathématiques", "Missions", "Musique",
    "Mémoire", "Objectifs", "Observation", "Optimisation", "Pari", "Placement", "Planification", "Plateau", "Plis", "Prise de risque", "Roll & Write",
    "Rôles", "Stratégie", "Tuiles", "Visualisation spatiale"];
let filterCategorie = createFilterCategories(
    "categorie", "Catégorie", "Catégorie :", games_low_categorie, () => { applyAllFilters(); }
);
document.querySelector(".filter-headers").append(filterCategorie[0]);
cont.insertBefore(filterCategorie[1], cont.children[cont.children.length - 1]);

// Filter Possede
const games_possede = ["Possède", "Possède pas"];
let filterPossede = createFilterPossede(
    "possede", "Possède", "Possède :", games_possede, () => { applyAllFilters(); }
);
document.querySelector(".filter-headers").append(filterPossede[0]);
cont.insertBefore(filterPossede[1], cont.children[cont.children.length - 1]);


function applyAllFilters() {
    toggleResetFilter();
 
    let nbGames = 0;

    Array.from(gamesDiv.children).forEach((game) => {
        const toFilter = filterPrix[0].getSelected(parseFloat(game.attributes.prix.value)) ||
                            filterAge[0].getSelected(parseInt(game.attributes.age.value)) ||
                            filterNbJoueurs[0].getSelected(game.attributes.nbJoueurs.value) ||
                            filterDuree[0].getSelected(parseInt(game.attributes.duree.value)) ||
                            filterEditeur[0].getSelected(game.attributes.editeur.value) ||
                            filterCategorie[0].getSelected(game.attributes.categories.value) ||
                            filterPossede[0].getSelected(game.attributes.possede.value);

        if (toFilter) {
            game.classList.remove("d-flex");
            game.classList.add("disabled");
        }
        else {
            game.classList.remove("disabled");
            game.classList.add("d-flex");
            nbGames++;
        }
    });

    sortGames(gamesDiv, document.getElementById("selectProductSort").value);

    if (nbGames > 1) document.getElementById("nbGames").textContent = `${nbGames} jeux`;
    else document.getElementById("nbGames").textContent = `${nbGames} jeu`;
}

function resetAllFilters() {
    toggleResetFilter();

    filterPrix[0].resetAll(true);
    filterAge[0].resetAll(true);
    filterNbJoueurs[0].resetAll(true);
    filterDuree[0].resetAll(true);
    filterEditeur[0].resetAll(true);
    filterCategorie[0].resetAll(true);
    filterPossede[0].resetAll(true);

    applyAllFilters();
}

document.querySelector(".title-reset").addEventListener("click", () => { resetAllFilters(); });
document.getElementById("selectProductSort").addEventListener("change", () => { sortGames(gamesDiv, document.getElementById("selectProductSort").value); });


function createCard(game, nb, possede) {
    const container = document.createElement("div");
    container.classList = "col d-flex m-0 mb-3";
    container.setAttribute("titre", game.titre);
    container.setAttribute("prix", game.prix);
    container.setAttribute("age", game.age);
    container.setAttribute("nbJoueurs", game.nbJoueurs);
    container.setAttribute("duree", game.duree);
    container.setAttribute("editeur", game.editeur);
    container.setAttribute("categories", game.categories);
    container.setAttribute("ordre", nb);
    container.setAttribute("possede", possede);

    const subContainer = document.createElement("div");
    subContainer.classList = "row g-1 border border-3 border-primary-subtle bg-white rounded-4 overflow-hidden p-2 flex-grow-1 m-0 d-flex flex-column justify-content-evenly";
    subContainer.id = "gameCard";

    const imageContainer = document.createElement("div");
    imageContainer.classList = "mb-3";
    imageContainer.id = "gameImageContainer";
    const image = document.createElement("img");
    image.classList = "img-fluid";
    image.src = game.lienImage;
    image.alt = game.titre;
    image.id = "gameImage";
    image.addEventListener("click", function () {
        viewGameDetails(game);
    });
    imageContainer.appendChild(image);

    const bodyContainer = document.createElement("div");
    bodyContainer.classList = "p-0 px-2 m-0 d-flex flex-column align-items-center";

    const title = document.createElement("h5");
    title.classList = "fw-bold m-0 mb-2 text-truncate w-100 text-center";
    title.innerText = game.titre;
    title.id = "gameTitle";
    title.addEventListener("click", function () {
        viewGameDetails(game);
    });

    const categoriesContainer = document.createElement("div");
    categoriesContainer.classList = "d-flex flex-wrap justify-content-center text-center mb-2 px-2";
    for (const category of game.categories) {
        const categoryValue = document.createElement("span");
        categoryValue.classList = "badge small bg-danger text-white m-0 me-2 mb-2";
        categoryValue.innerText = category;
        categoriesContainer.appendChild(categoryValue);
    }

    const infosList = [
        ["Age minimum", game.age, "escalator_warning"],
        ["Nombre de joueurs", game.nbJoueurs, "groups"],
        ["Durée de la partie", game.duree, "schedule"],
        ["Editeur", game.editeur, "edit_note"],
        ["Prix", `${game.prix} €`]
    ];
    const infosContainer = document.createElement("div");
    infosContainer.classList = "d-flex flex-wrap justify-content-center";
    for (const info of infosList) {
        const div = document.createElement("div");
        div.classList = "badge small bg-secondary-subtle text-black d-flex align-items-center m-0 me-2 mb-2";
        div.title = info[0];
        if (info.length === 3) {
            const icon = document.createElement("span");
            icon.classList = "material-symbols-outlined me-2";
            icon.innerText = info[2];
            div.appendChild(icon);
        }
        const value = document.createElement("span");
        value.innerText = info[1];
        div.appendChild(value);
        infosContainer.appendChild(div);
    }

    bodyContainer.appendChild(title);
    bodyContainer.appendChild(categoriesContainer);
    bodyContainer.appendChild(infosContainer);

    subContainer.appendChild(imageContainer);
    subContainer.appendChild(bodyContainer);

    container.appendChild(subContainer);
    return container;
}

function viewGameDetails(game) {
    // sessionStorage.setItem("game", JSON.stringify(game));
    // window.location.replace("GameDetails/GameDetails.html");
    console.log("Acces a la page du jeu " + game.titre);
}

async function loadGames() {
    try {
        // Version shuffle
        // const FILE_PATH_OWNED = "/site/resources/data/games/owned_games_low.json";
        // const FILE_PATH_WANTED = "/site/resources/data/games/wanted_games_low.json";

        // function shuffleArray(array) {
        //     for (let i = array.length - 1; i > 0; i--) {
        //         const j = Math.floor(Math.random() * (i + 1));
        //         [array[i], array[j]] = [array[j], array[i]];
        //     }
        // }

        // const [response_owned, response_wanted] = await Promise.all([
        //     fetch(FILE_PATH_OWNED),
        //     fetch(FILE_PATH_WANTED)
        // ]);

        // if (!response_owned.ok) throw new Error(`Erreur lors du chargement de ${FILE_PATH_OWNED}`);
        // if (!response_wanted.ok) throw new Error(`Erreur lors du chargement de ${FILE_PATH_WANTED}`);

        // const owned_games = await response_owned.json();
        // const wanted_games = await response_wanted.json();

        // const tagged_owned = owned_games.map((game) => ({ ...game, owned: true }));
        // const tagged_wanted = wanted_games.map((game) => ({ ...game, owned: false }));


        // const all_games = [...tagged_owned, ...tagged_wanted];
        // shuffleArray(all_games);

        // all_games.forEach((game, index) => {
        //     gamesDiv.appendChild(createCard(game, index, game.owned));
        // });

        // if (gamesDiv.children.length > 1) document.getElementById("nbGames").textContent = `${gamesDiv.children.length} jeux`;
        // else document.getElementById("nbGames").textContent = `${gamesDiv.children.length} jeu`;



        // Owned games
        const FILE_PATH_OWNED = "/site/resources/data/games/owned_games_low.json";
        const response_owned = await fetch(FILE_PATH_OWNED);
        if (!response_owned.ok) throw new Error(`Erreur lors du chargement du fichier ${FILE_PATH_OWNED}`);
        const owned_games = await response_owned.json();
        owned_games.forEach((game, index) => {
            gamesDiv.appendChild(createCard(game, index, true));
        });

        const nb = owned_games.length;

        // Wanted games
        const FILE_PATH_WANTED = "/site/resources/data/games/wanted_games_low.json";
        const response_wanted = await fetch(FILE_PATH_WANTED);
        if (!response_wanted.ok) throw new Error(`Erreur lors du chargement du fichier ${FILE_PATH_WANTED}`);
        const wanted_games = await response_wanted.json();
        wanted_games.forEach((game, index) => {
            gamesDiv.appendChild(createCard(game, index + nb, false));
        });

        if (gamesDiv.children.length > 1) document.getElementById("nbGames").textContent = `${gamesDiv.children.length} jeux`;
        else document.getElementById("nbGames").textContent = `${gamesDiv.children.length} jeu`;
    } catch (error) {
        console.error("Erreur :", error);
    }
}

loadGames();
