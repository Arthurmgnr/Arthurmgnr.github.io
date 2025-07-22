
import { createFilterGroupElement, createFilterSelectionItem } from "/site/components/filter.js";
import { firstIncludesSecond } from "/site/components/common.js";

export function createFilterDropdown(categorie, titleElement, titleItem, items, onChange) {
    // Constantes
    let filtersActif = [];

    // -------------------------

    // FilterGroupElement
    const values = createFilterGroupElement(categorie, titleElement);
    const filterGroupElement = values[0];
    const filterGroupBlock = values[1];
    const filterGroup = values[2];

    const scrollableDropdownContainer = document.createElement("div");
    scrollableDropdownContainer.classList = "scrollable-dropdown-container";
    const input = document.createElement("input");
    input.type = "text";
    input.id = categorie;
    input.placeholder = "Choisissez une valeur...";
    const scrollableDropdown = document.createElement("div");
    scrollableDropdown.classList = "scrollable-dropdown";
    scrollableDropdown.id = `${categorie}-list`;

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "scrollable-dropdown-item";
        div.id = `item-${item.replaceAll("'", "").replaceAll("-", "").split(" ").join("_")}`;
        div.textContent = item;
        scrollableDropdown.appendChild(div);
    });

    scrollableDropdownContainer.append(input, scrollableDropdown);
    filterGroupBlock.append(scrollableDropdownContainer);
    filterGroupElement.append(filterGroupBlock);

    // -------------------------

    // FilterSelectedItem
    const filterSelectedItem = createFilterSelectionItem(categorie, titleItem);

    // -------------------------

    input.addEventListener("focus", () => {
        scrollableDropdown.style.display = "block";
    });

    input.addEventListener("keyup", () => {
        const value = input.value;
        const selectedItems = Array.from(filterSelectedItem.children).slice(1).map(item => item.classList[1].split("-")[2].split("_").join(" "));
        Array.from(scrollableDropdown.children).forEach(item => {
            const itemText = item.textContent;
            if (firstIncludesSecond(itemText, value) && !firstIncludesSecond(selectedItems, itemText)) item.style.display = "block";
            else item.style.display = "none";
        });
    });

    scrollableDropdown.addEventListener("click", (event) => {
        if (event.target.tagName === "DIV") {
            addSelectedItemDropdown(categorie, event.target.textContent, scrollableDropdown, filterSelectedItem);
            input.value = "";
            scrollableDropdown.style.display = "none";
            Array.from(scrollableDropdown.children).forEach(item => {
                if (firstIncludesSecond(item.textContent, event.target.textContent)) item.style.display = "none";
                else item.style.display = "block";
            });
        }
    });
    
    input.addEventListener("blur", () => {
        setTimeout(() => scrollableDropdown.style.display = "none", 200);
    });

    function addSelectedItemDropdown(id, text, list, container) {
        filtersActif.push(text.replaceAll("'", "").replaceAll("-", ""));
        container.classList.remove("disabled");

        const div = document.createElement("div");
        div.classList = `filter-selected-item-content item-${id}-${text.replaceAll("'", "").replaceAll("-", "").split(" ").join("_")}`;
        const span = document.createElement("span");
        span.classList = "filter-selected-item-content-text";
        span.addEventListener("click", () => {
            filtersActif.splice(filtersActif.indexOf(text.replaceAll("'", "").replaceAll("-", "")), 1);
            container.removeChild(div);
            Array.from(list.children).forEach(item => {
                if (firstIncludesSecond(item.textContent, text)) item.style.display = "block";
            });
            if ((container.children.length - 1) === 0) container.classList.add("disabled");

            onChange();
        });
        span.innerHTML = `${text}<span class="material-symbols-outlined filter-selected-item-content-icon">close</span>`;
        div.appendChild(span);
        
        container.appendChild(div);

        onChange();
    }

    // -------------------------

    filterGroupElement.resetAll = function(bool) {
        const temp = filtersActif.slice();
        
        temp.forEach(item => document.querySelector(`.item-${categorie}-${item.split(" ").join("_")}`).querySelector("span").click());

        if (filterGroup.getAttribute("aria-expanded") === "true") filterGroup.click();

        if (bool) onChange();
    }

    return [filterGroupElement, filterSelectedItem, filtersActif];
}
