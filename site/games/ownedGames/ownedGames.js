
import { sortGames, addFilterValuesHeader, applyAllFilters, resetAllFilters, loadGames } from "/site/components/common.js";
import { createFilterPrix } from "/site/components/filter-prix.js";
import { createFilterAge } from "/site/components/filter-age.js";
import { createFilterNbJoueurs } from "/site/components/filter-nbJoueurs.js";
import { createFilterDuree } from "/site/components/filter-duree.js";
import { createFilterEditeur } from "/site/components/filter-editeur.js";
import { createFilterCategories } from "/site/components/filter-categories.js";

// -------------------------------------------------------------------------------------

const gamesDiv = document.querySelector("#games-container");

// 60 jeux

// Filter Prix
const games_low_min = 7;
const games_low_max = 95;
const filterPrix = createFilterPrix(
    "prix", "Prix", "Prix :", games_low_min, games_low_max, () => { callApplyAllFilters(); }
);

// Filter Age
const games_low_age = ["6 et +", "7 et +", "8 et +", "9 et +", "10 et +", "12 et +", "14 et +", "16 et +"];
const filterAge = createFilterAge(
    "age", "Âge", "Âge minimum :", games_low_age, () => { callApplyAllFilters(); }
);

// Filter NbJoueurs
const games_low_nbJoueurs = ["1", "2", "2 et +", "3 et +", "4 et +", "5 et +", "6 et +", "7 et +", "8 et +", "9 et +", "10 et +"];
const filterNbJoueurs = createFilterNbJoueurs(
    "nbJoueurs", "Nombre de joueurs", "Nombre de joueurs :", games_low_nbJoueurs, () => { callApplyAllFilters(); }
);

// Filter Duree
const games_low_duree = ["15 min max", "15-30 min", "30-45 min", "45-60 min", "+ de 60 min"];
const filterDuree = createFilterDuree(
    "duree", "Durée", "Durée moyenne :", games_low_duree, () => { callApplyAllFilters(); }
);

// Filter Editeur
const games_low_editeur = ["Asmodée", "Bakakou", "Blackrock Games", "Blue Orange", "Bombyx", "Catch Up Games", "Cocktail Games", "Cocktail games", "Days of Wonder",
    "Don't Panic Games", "Dujardin", "Débâcle Jeux", "Flip Flap Éditions", "Gamewright", "Gigamic", "Grandpa Beck's Games", "Hasbro", "Helvetiq", "Hurrican", "Iello",
    "KYF Edition", "Libellud", "Lumberjacks Studio", "Magilano", "Mixlore", "Origames", "Oya", "Ravensburger", "Repos Production", "Schmidt Spiele GmbH",
    "Scorpion Masqué", "Smart Games", "Space Cowboys", "Spiral Editions", "Studio H", "Yaqua Studio", "Z-Man Games"];
const filterEditeur = createFilterEditeur(
    "editeur", "Editeur", "Editeur :", games_low_editeur, () => { callApplyAllFilters(); }
);

// Filter Categorie
const games_low_categorie = ["Alignement", "Aléatoire", "Ambiance", "Association d'idées", "Aventure", "Bluff", "Cartes", "Casse-tête", "Chronologie", "Civilisation",
    "Code", "Combinaison", "Communication", "Connaissance", "Construction", "Coopératif", "Crimes", "Culture générale", "Dextérité", "Draw & Write", "Déduction",
    "Dés", "Développement", "Educatif", "Enchères", "Enigme", "Enquête", "Escape Game", "Exploration", "Extension", "Familial", "Gestion de ressources",
    "Interprétation d'images", "Jeu de mots", "Logique", "Mathématiques", "Missions", "Musique", "Mémoire", "Objectifs", "Observation", "Optimisation", "Pari",
    "Planification", "Plateau", "Plis", "Prise de risque", "Risque", "Roll & Write", "Rôles", "Stratégie", "Tuiles", "Visualisation spatiale"];
const filterCategorie = createFilterCategories(
    "categorie", "Catégorie", "Catégorie :", games_low_categorie, () => { callApplyAllFilters(); }
);

addFilterValuesHeader(document.querySelector(".filter-headers"), document.getElementById("filters-list"),
    filterPrix, filterAge, filterNbJoueurs, filterDuree, filterEditeur, filterCategorie
);

const filters = [
    { filter: filterPrix, value: (game) => parseFloat(game.attributes.prix.value) },
    { filter: filterAge, value: (game) => parseInt(game.attributes.age.value) },
    { filter: filterNbJoueurs, value: (game) => game.attributes.nbJoueurs.value },
    { filter: filterDuree, value: (game) => parseInt(game.attributes.duree.value) },
    { filter: filterEditeur, value: (game) => game.attributes.editeur.value },
    { filter: filterCategorie, value: (game) => game.attributes.categories.value },
];

function callApplyAllFilters() {
    applyAllFilters(gamesDiv, document.getElementById("selectProductSort").value,
        document.getElementById("nbGames"), filters
    );
}

document.querySelector(".title-reset").addEventListener("click", () => {
    resetAllFilters(gamesDiv, document.getElementById("selectProductSort").value,
        document.getElementById("nbGames"), filters);
});
document.getElementById("selectProductSort").addEventListener("change", () => { sortGames(gamesDiv, document.getElementById("selectProductSort").value); });

function viewGameDetails(game) {
    // sessionStorage.setItem("game", JSON.stringify(game));
    // window.location.replace("GameDetails/GameDetails.html");
    console.log("Acces a la page du jeu " + game.titre);
}

loadGames(gamesDiv, document.getElementById("nbGames"),
    ["owned_games_low.json", null]
);
