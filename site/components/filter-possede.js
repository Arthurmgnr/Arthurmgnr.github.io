
import { createFilterClick } from "/site/components/filter-click.js";

export function createFilterPossede(categorie, titleElement, titleItem, items, onChange) {
    const values = createFilterClick(categorie, titleElement, titleItem, items, onChange);
    const filterGroupElement = values[0];
    const filterSelectedItem = values[1];
    const filtersActif = values[2];

    filterGroupElement.getSelected = function(value) {
        if (filtersActif.length === 0) return false;
        else {
            let toFilter = false;
            for (let index of filtersActif) {
                if (items[index] === "Possède" && value === "true") toFilter = true;
                else if (items[index] === "Possède pas" && value === "false") toFilter = true;
            }

            if (!toFilter) return true;
            else return false;
        }
    }

    return [filterGroupElement, filterSelectedItem];
}
