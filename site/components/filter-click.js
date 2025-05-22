
import { createFilterGroupElement, createFilterSelectionItem} from "/site/components/filter.js";

export function createFilterClick(categorie, titleElement, titleItem, items, onChange) {
    // Constantes
    let filtersActif = [];
    let filtersGroupBlock = [];
    let filtersSelectedItem = [];

    // -------------------------

    // FilterGroupElement
    const values = createFilterGroupElement(categorie, titleElement);
    const filterGroupElement = values[0];
    const filterGroupBlock = values[1];
    const filterGroup = values[2];
    const dFlex = document.createElement("div");
    dFlex.classList = "d-flex flex-wrap";
    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "selection-item";
        div.id = `item-${categorie}-${index}`;
        div.onclick = function() {
            filterGroupElement.reset(true, index);
        };
        div.textContent = item;
        filtersGroupBlock.push(div);
        dFlex.appendChild(div);
    });
    filterGroupBlock.append(dFlex);
    filterGroupElement.append(filterGroupBlock);

    // -------------------------

    // FilterSelectedItem
    const filterSelectedItem = createFilterSelectionItem(categorie, titleItem);

    items.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList = `filter-selected-item-content disabled item-${categorie}-${index}`;
        const span1 = document.createElement("span");
        span1.className = "filter-selected-item-content-text";
        span1.onclick = function() {
            filterGroupElement.reset(true, index);
        };
        span1.textContent = item;
        const span2 = document.createElement("span");
        span2.classList = "material-symbols-outlined filter-selected-item-content-icon";
        span2.textContent = "close";
        span1.appendChild(span2);
        div.appendChild(span1);
        filtersSelectedItem.push(div);
        filterSelectedItem.appendChild(div);
    });

    // -------------------------

    filterGroupElement.resetAll = function(bool) {
        const temp = filtersActif.slice();
        for (let index of temp) {
            filterGroupElement.reset(bool, index);
        }

        if (filterGroup.getAttribute("aria-expanded") === "true") filterGroup.click();
    }

    filterGroupElement.reset = function(bool, index) {
        filtersGroupBlock[index].classList.toggle("selection-item-selected");

        if (filtersSelectedItem[index].classList.contains("disabled")) {
            filtersSelectedItem[index].classList.remove("disabled");
            filterSelectedItem.classList.remove("disabled");
            filtersActif.push(index);
        } else {
            filtersSelectedItem[index].classList.add("disabled");
            filtersActif.splice(filtersActif.indexOf(index), 1);
            if (filtersActif.length > 0) filterSelectedItem.classList.remove("disabled");
            else filterSelectedItem.classList.add("disabled");
        }

        if (bool) onChange();
    }

    return [filterGroupElement, filterSelectedItem, filtersActif];
}
