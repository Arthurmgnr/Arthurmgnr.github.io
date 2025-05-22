
import { toggleAriaExpanded } from "/site/components/common.js";

export function createFilterGroupElement(categorie, titleElement) {
    // FilterGroupElement
    const filterGroupElement = document.createElement("div");
    filterGroupElement.classList = "filter-group-element";
    const filterGroup = document.createElement("div");
    filterGroup.classList = "filter-group";
    filterGroup.id = `filter-${categorie}`;
    filterGroup.setAttribute("aria-expanded", "false");
    filterGroup.onclick = function() { toggleAriaExpanded(this); }
    const filterGroupTitle = document.createElement("filter-group-title");
    filterGroupTitle.classList = "filter-group-title";
    filterGroupTitle.innerText = titleElement;
    const spanTitle = document.createElement("span");
    spanTitle.classList = "material-symbols-outlined filter-group-chevron";
    spanTitle.innerText = "keyboard_arrow_down";
    filterGroup.append(filterGroupTitle, spanTitle);
    filterGroupElement.append(filterGroup);

    const filterGroupBlock = document.createElement("div");
    filterGroupBlock.classList = "filter-group-block";
    filterGroupBlock.id = `filter-${categorie}`;

    return [filterGroupElement, filterGroupBlock, filterGroup];
}

export function createFilterSelectionItem(categorie, titleItem) {
    // FilterSelectedItem
    const filterSelectedItem = document.createElement("div");
    filterSelectedItem.classList = `filter-selected-item item-${categorie} disabled`;
    const filterSelectedItemTitle = document.createElement("div");
    filterSelectedItemTitle.classList = "filter-selected-item-title";
    filterSelectedItemTitle.innerText = titleItem;
    filterSelectedItem.append(filterSelectedItemTitle);

    return filterSelectedItem;
}
