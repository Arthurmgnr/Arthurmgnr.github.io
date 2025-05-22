
export function int(nb) { return parseInt(nb); }

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
