
import { sortGames, addFilterValuesHeader, applyAllFilters, resetAllFilters, loadGames, setDesktopOrMobile, displayFilters } from "/site/components/common.js";
import { createFilterPrix } from "/site/components/filter-prix.js";
import { createFilterAge } from "/site/components/filter-age.js";
import { createFilterNbJoueurs } from "/site/components/filter-nbJoueurs.js";
import { createFilterDuree } from "/site/components/filter-duree.js";
import { createFilterEditeur } from "/site/components/filter-editeur.js";
import { createFilterCategories } from "/site/components/filter-categories.js";

// -------------------------------------------------------------------------------------

setDesktopOrMobile();

const gamesDiv = document.querySelector("#games-container");

// 37 jeux

// Filter Prix
const games_low_min = 8;
const games_low_max = 37;
const filterPrix = createFilterPrix(
    "prix", "Prix", "Prix :", games_low_min, games_low_max, () => { callApplyAllFilters(); }
);

// Filter Age
const games_low_age = ["7 et +", "8 et +", "10 et +", "12 et +", "14 et +", "16 et +", "18 et +"];
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
const games_low_editeur = ["Bankiiiz Editions", "Catch Up Games", "Cocktail games", "Final Score", "Flip Flap Éditions", "Gamelia", "Iello", "KYF Edition",
    "Libellud", "Ludonaute", "OldChap Editions", "Origames", "Savana", "Space Cowboys", "Spielwiese", "Studio H", "Tiki Editions"];
const filterEditeur = createFilterEditeur(
    "editeur", "Editeur", "Editeur :", games_low_editeur, () => { callApplyAllFilters(); }
);

// Filter Categorie
const games_low_categorie = ["Affrontement", "Ambiance", "Bluff", "Cartes", "Combinaison", "Connexion", "Coopératif", "Couleurs", "Course", "Créativité",
    "Draw and Write", "Déduction", "Enchères", "Enigme", "Enquête", "Escape Game", "Mots", "Mémoire", "Observation", "Pari", "Placement", "Plis", "Pouvoirs",
    "Programmation", "Rapidité", "Réflexion", "Rôles", "Tuiles"];
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

loadGames(gamesDiv, document.getElementById("nbGames"),
    ["wanted_games_low.json", null]
);

document.getElementById("filter-container").addEventListener("click", () => { displayFilters(); });
