
import { sortGames, addFilterValuesHeader, applyAllFilters, resetAllFilters, loadGames } from "/site/components/common.js";
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
const filterPrix = createFilterPrix(
    "prix", "Prix", "Prix :", games_low_min, games_low_max, () => { callApplyAllFilters(); }
);

// Filter Age
const games_low_age = ["6 et +", "7 et +", "8 et +", "9 et +", "10 et +", "12 et +", "14 et +", "16 et +", "18 et +"];
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
const games_low_editeur = ["Actarus Editions", "Asmodée", "Bakakou", "Bankiiiz Editions", "Big Moustache Games", "Blackrock Games", "Blue Orange", "Bombyx",
    "Catch Up Games", "Cocktail Games", "Cocktail games", "Days of Wonder", "Days of wonder", "Don't Panic Games", "Dujardin", "Débâcle Jeux", "Flip Flap Editions",
    "Flip Flap Éditions", "Funnyfox", "Gamelia", "Gamewright", "Gigamic", "Grandpa Beck's Games", "Hasbro", "Helvetiq", "Hurrican", "Iello", "KYF Edition",
    "Libellud", "Ludonaute", "Lumberjacks Studio", "Magilano", "Matagot", "Mixlore", "Next Move", "OldChap Editions", "Origames", "Oya", "Ravensburger",
    "Repos Production", "Schmidt Spiele GmbH", "Scorpion Masqué", "Smart Games", "Space Cowboys", "Spielwiese", "Spiral Editions", "Studio H", "Yaqua Studio",
    "Z-Man Games"];
const filterEditeur = createFilterEditeur(
    "editeur", "Editeur", "Editeur :", games_low_editeur, () => { callApplyAllFilters(); }
);

// Filter Categorie
const games_low_categorie = ["Affrontement", "Alignement", "Aléatoire", "Ambiance", "Association d'idées", "Aventure", "Bluff", "Cartes", "Casse-tête",
    "Chronologie", "Civilisation", "Code", "Collection", "Combinaison", "Communication", "Connaissance", "Construction", "Coopératif", "Course", "Crimes",
    "Culture générale", "Dextérité", "Draft", "Draw & Write", "Déduction", "Dés", "Développement", "Educatif", "Enchères", "Enigme", "Enquête", "Escape Game",
    "Exploration", "Extension", "Familial", "Gestion de ressources", "Interprétation d'images", "Jeu de mots", "Logique", "Mathématiques", "Missions", "Mots",
    "Musique", "Mémoire", "Objectifs", "Observation", "Optimisation", "Pari", "Placement", "Planification", "Plateau", "Plis", "Pouvoirs", "Prise de risque",
    "Programmation", "Rapidité", "Risque", "Roll & Write", "Réflexion", "Rôles", "Stratégie", "Tuiles", "Visualisation spatiale"];
const filterCategorie = createFilterCategories(
    "categorie", "Catégorie", "Catégorie :", games_low_categorie, () => { callApplyAllFilters(); }
);

// Filter Possede
const games_possede = ["Possède", "Possède pas"];
const filterPossede = createFilterPossede(
    "possede", "Possède", "Possède :", games_possede, () => { callApplyAllFilters(); }
);

addFilterValuesHeader(document.querySelector(".filter-headers"), document.getElementById("filters-list"),
    filterPrix, filterAge, filterNbJoueurs, filterDuree, filterEditeur, filterCategorie, filterPossede
);

const filters = [
    { filter: filterPrix, value: (game) => parseFloat(game.attributes.prix.value) },
    { filter: filterAge, value: (game) => parseInt(game.attributes.age.value) },
    { filter: filterNbJoueurs, value: (game) => game.attributes.nbJoueurs.value },
    { filter: filterDuree, value: (game) => parseInt(game.attributes.duree.value) },
    { filter: filterEditeur, value: (game) => game.attributes.editeur.value },
    { filter: filterCategorie, value: (game) => game.attributes.categories.value },
    { filter: filterPossede, value: (game) => game.attributes.possede.value }
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

// async function loadGames() {
//     try {
//         // Version shuffle
//         // const FILE_PATH_OWNED = "/site/resources/data/games/owned_games_low.json";
//         // const FILE_PATH_WANTED = "/site/resources/data/games/wanted_games_low.json";

//         // function shuffleArray(array) {
//         //     for (let i = array.length - 1; i > 0; i--) {
//         //         const j = Math.floor(Math.random() * (i + 1));
//         //         [array[i], array[j]] = [array[j], array[i]];
//         //     }
//         // }

//         // const [response_owned, response_wanted] = await Promise.all([
//         //     fetch(FILE_PATH_OWNED),
//         //     fetch(FILE_PATH_WANTED)
//         // ]);

//         // if (!response_owned.ok) throw new Error(`Erreur lors du chargement de ${FILE_PATH_OWNED}`);
//         // if (!response_wanted.ok) throw new Error(`Erreur lors du chargement de ${FILE_PATH_WANTED}`);

//         // const owned_games = await response_owned.json();
//         // const wanted_games = await response_wanted.json();

//         // const tagged_owned = owned_games.map((game) => ({ ...game, owned: true }));
//         // const tagged_wanted = wanted_games.map((game) => ({ ...game, owned: false }));


//         // const all_games = [...tagged_owned, ...tagged_wanted];
//         // shuffleArray(all_games);

//         // all_games.forEach((game, index) => {
//         //     gamesDiv.appendChild(createCard(game, index, game.owned));
//         // });

//         // if (gamesDiv.children.length > 1) document.getElementById("nbGames").textContent = `${gamesDiv.children.length} jeux`;
//         // else document.getElementById("nbGames").textContent = `${gamesDiv.children.length} jeu`;



//         // Owned games
//         const FILE_PATH_OWNED = "/site/resources/data/games/owned_games_low.json";
//         const response_owned = await fetch(FILE_PATH_OWNED);
//         if (!response_owned.ok) throw new Error(`Erreur lors du chargement du fichier ${FILE_PATH_OWNED}`);
//         const owned_games = await response_owned.json();
//         owned_games.forEach((game, index) => {
//             gamesDiv.appendChild(createCard(game, index, true));
//         });

//         const nb = owned_games.length;

//         // Wanted games
//         const FILE_PATH_WANTED = "/site/resources/data/games/wanted_games_low.json";
//         const response_wanted = await fetch(FILE_PATH_WANTED);
//         if (!response_wanted.ok) throw new Error(`Erreur lors du chargement du fichier ${FILE_PATH_WANTED}`);
//         const wanted_games = await response_wanted.json();
//         wanted_games.forEach((game, index) => {
//             gamesDiv.appendChild(createCard(game, index + nb, false));
//         });

//         if (gamesDiv.children.length > 1) document.getElementById("nbGames").textContent = `${gamesDiv.children.length} jeux`;
//         else document.getElementById("nbGames").textContent = `${gamesDiv.children.length} jeu`;
//     } catch (error) {
//         console.error("Erreur :", error);
//     }
// }

loadGames(gamesDiv, document.getElementById("nbGames"),
    ["owned_games_low.json", true], ["wanted_games_low.json", false]
);
