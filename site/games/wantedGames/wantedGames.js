
import { toggleResetFilter, sortGames } from "/site/components/common.js";
import { createFilterPrix } from "/site/components/filter-prix.js";
import { createFilterAge } from "/site/components/filter-age.js";
import { createFilterNbJoueurs } from "/site/components/filter-nbJoueurs.js";
import { createFilterDuree } from "/site/components/filter-duree.js";
import { createFilterEditeur } from "/site/components/filter-editeur.js";
import { createFilterCategories } from "/site/components/filter-categories.js";

// -------------------------------------------------------------------------------------

const gamesDiv = document.querySelector("#games-container");

// 11 jeux

// Filter Prix
const games_low_min = 8;
const games_low_max = 42;
let filterPrix = createFilterPrix(
    "prix", "Prix", "Prix :", games_low_min, games_low_max, () => { applyAllFilters(); }
);
filterPrix[0].updateSlider();
document.querySelector(".filter-headers").append(filterPrix[0]);
const cont = document.getElementById("filters-list");
cont.insertBefore(filterPrix[1], cont.children[cont.children.length - 1]);

// Filter Age
// const games_low_age = ["6 et +", "8 et +", "9 et +", "10 et +", "12 et +", "14 et +", "16 et +"];
const games_low_age = ["8 et +", "10 et +", "12 et +", "18 et +"];
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
// const games_low_duree = ["15 min max", "15-30 min", "30-45 min", "45-60 min", "+ de 60 min"];
const games_low_duree = ["15-30 min", "30-45 min", "45-60 min", "+ de 60 min"];
let filterDuree = createFilterDuree(
    "duree", "Durée", "Durée moyenne :", games_low_duree, () => { applyAllFilters(); }
);
document.querySelector(".filter-headers").append(filterDuree[0]);
cont.insertBefore(filterDuree[1], cont.children[cont.children.length - 1]);

// Filter Editeur
const games_low_editeur = ["Flip Flap Editions", "Matagot", "Next Move", "OldChap Editions", "Spielwiese", "Studio H"];
let filterEditeur = createFilterEditeur(
    "editeur", "Editeur", "Editeur :", games_low_editeur, () => { applyAllFilters(); }
);
document.querySelector(".filter-headers").append(filterEditeur[0]);
cont.insertBefore(filterEditeur[1], cont.children[cont.children.length - 1]);

// Filter Categorie
const games_low_categorie = ["Ambiance", "Cartes", "Collection", "Coopératif", "Déduction", "Enigme", "Observation", "Placement", "Stratégie", "Tuiles"];
let filterCategorie = createFilterCategories(
    "categorie", "Catégorie", "Catégorie :", games_low_categorie, () => { applyAllFilters(); }
);
document.querySelector(".filter-headers").append(filterCategorie[0]);
cont.insertBefore(filterCategorie[1], cont.children[cont.children.length - 1]);

function applyAllFilters() {
    toggleResetFilter();
 
    let nbGames = 0;

    Array.from(gamesDiv.children).forEach((game) => {
        const toFilter = filterPrix[0].getSelected(parseFloat(game.attributes.prix.value)) ||
                            filterAge[0].getSelected(parseInt(game.attributes.age.value)) ||
                            filterNbJoueurs[0].getSelected(game.attributes.nbJoueurs.value) ||
                            filterDuree[0].getSelected(parseInt(game.attributes.duree.value)) ||
                            filterEditeur[0].getSelected(game.attributes.editeur.value) ||
                            filterCategorie[0].getSelected(game.attributes.categories.value);

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

    applyAllFilters();
}

document.querySelector(".title-reset").addEventListener("click", () => { resetAllFilters(); });
document.getElementById("selectProductSort").addEventListener("change", () => { sortGames(gamesDiv, document.getElementById("selectProductSort").value); });


function createCard(game, nb) {
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
        const FILE_PATH = "/site/resources/data/games/wanted_games_low.json";
        const response = await fetch(FILE_PATH);
        if (!response.ok) throw new Error(`Erreur lors du chargement du fichier ${FILE_PATH}`);
        const data = await response.json();
        data.forEach((game, index) => {
            gamesDiv.appendChild(createCard(game, index));
        });

        if (gamesDiv.children.length > 1) document.getElementById("nbGames").textContent = `${gamesDiv.children.length} jeux`;
        else document.getElementById("nbGames").textContent = `${gamesDiv.children.length} jeu`;
    } catch (error) {
        console.error("Erreur :", error);
    }
}

loadGames();
