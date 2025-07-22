
// export function int(nb) { return parseInt(nb); }

export function sortGames(container, valeur) {
    const valeurKey = valeur.split(":")[0];
    const valeurSort = valeur.split(":")[1];
    const elements = Array.from(container.children);
    elements.sort((a, b) => {
        if (valeurKey === "titre") {
            return valeurSort === "asc"
                ? a.getAttribute(valeurKey).localeCompare(b.getAttribute(valeurKey))
                : b.getAttribute(valeurKey).localeCompare(a.getAttribute(valeurKey));
        } else {
            const numA = parseFloat(a.getAttribute(valeurKey));
            const numB = parseFloat(b.getAttribute(valeurKey));
            return valeurSort === "asc" ? numA - numB : numB - numA;
        }
    });
    container.innerHTML = "";
    elements.forEach(elt => container.append(elt));
}

export function toggleResetFilter() {
    const regex = new RegExp("item-[a-zA-Z]*");
    const elts = document.getElementById("filters-list").children;
    const bool = Array.from(elts).filter(elt => elt.tagName !== "H4" && !elt.classList.contains("item-reset")).some(el =>
            Array.from(el.classList).some(cls => regex.test(cls)) && !el.classList.contains("disabled"));
    // console.log(bool);
    // console.log(Array.from(elts).filter(elt => elt.tagName !== "H4" && !elt.classList.contains("item-reset")));
    if (bool) document.querySelector(".item-reset").classList.remove("disabled");
    else document.querySelector(".item-reset").classList.add("disabled");
}

export function toggleAriaExpanded(div) {
    const isExpanded = div.getAttribute("aria-expanded") === "true";

    div.setAttribute("aria-expanded", !isExpanded);

    document.querySelectorAll(`#${div.id}`)[1].style.display = isExpanded ? "none" : "block";
}

export function addFilterValuesHeader(headersElement, filterListeElements, ...filters) {
    const lastChild = filterListeElements.lastElementChild;
    filters.forEach(filter => {
        headersElement.append(filter[0]);
        filterListeElements.insertBefore(filter[1], lastChild);
    });
}

export function applyAllFilters(container, valeur, nbGamesContainer, filters) {
    toggleResetFilter();
     
    let nbGames = 0;

    Array.from(container.children).forEach((game) => {
        const toFilter = filters.some(({ filter, value }) => filter[0].getSelected(value(game)));

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

    sortGames(container, valeur);

    if (nbGames > 1) nbGamesContainer.textContent = `${nbGames} jeux`;
    else nbGamesContainer.textContent = `${nbGames} jeu`;
}

export function resetAllFilters(container, valeur, nbGamesContainer, filters) {
    toggleResetFilter();

    filters.forEach(({ filter }) => filter[0].resetAll(true));

    applyAllFilters(container, valeur, nbGamesContainer, filters);
}

export async function loadGames(gamesDiv, nbGamesContainer, ...params) {
    try {
        const BASE_URL = "/site/resources/data/games/";

        let nb = 0;

        for (const param of params) {
            const file = param[0];
            const bool = param[1];

            const FILE_PATH = BASE_URL + file;
            const response = await fetch(FILE_PATH);
            if (!response.ok) throw new Error(`Erreur lors du chargement du fichier ${FILE_PATH}`);
            const games = await response.json();

            for (const game of games) {
                gamesDiv.appendChild(createCard(game, nb, bool));
                nb++;
            }
        }

        nbGamesContainer.textContent = `${nb} ${nb > 1 ? "jeux" : "jeu"}`;
    } catch (error) {
        console.error("Erreur :", error);
    }
}

export function createCard(game, nb, possede) {
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
    if (possede != null) container.setAttribute("possede", possede);

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
    // image.addEventListener("click", function () {
    //     viewGameDetails(game);
    // });
    imageContainer.appendChild(image);

    const bodyContainer = document.createElement("div");
    bodyContainer.classList = "p-0 px-2 m-0 d-flex flex-column align-items-center";

    const title = document.createElement("h5");
    title.classList = "fw-bold m-0 mb-2 text-truncate w-100 text-center";
    title.innerText = game.titre;
    title.id = "gameTitle";
    // title.addEventListener("click", function () {
    //     viewGameDetails(game);
    // });

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

export function firstIncludesSecond(first, second) {
    function normalizeString(str) { return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

    const f = normalizeString(first);
    const s = normalizeString(second);
    return f.includes(s);
}

function viewGameDetails(game) {
    // sessionStorage.setItem("game", JSON.stringify(game));
    // window.location.replace("GameDetails/GameDetails.html");
    console.log("Acces a la page du jeu " + game.titre);
}
