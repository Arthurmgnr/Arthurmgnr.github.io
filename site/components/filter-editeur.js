
import { createFilterDropdown } from "/site/components/filter-dropdown.js";

export function createFilterEditeur(categorie, titleElement, titleItem, items, onChange) {
    const values = createFilterDropdown(categorie, titleElement, titleItem, items, onChange);
    const filterGroupElement = values[0];
    const filterSelectedItem = values[1];
    const filtersActif = values[2];

    filterGroupElement.getSelected = function(value) {
        if (filtersActif.length === 0) {
            return false;
        } else {
            return !filtersActif.includes(value.replaceAll("'", "").replaceAll("-", ""));
        }
    }

    return [filterGroupElement, filterSelectedItem];
}
