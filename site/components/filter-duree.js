
import { createFilterClick } from "/site/components/filter-click.js";

export function createFilterDuree(categorie, titleElement, titleItem, items, onChange) {
    const values = createFilterClick(categorie, titleElement, titleItem, items, onChange);
    const filterGroupElement = values[0];
    const filterSelectedItem = values[1];
    const filtersActif = values[2];

    filterGroupElement.getSelected = function(value) {
        let toFilter = false;
        let l = [];
        filtersActif.forEach(index => l.push(items[index]));
        if (l.length === 0) return false;
        if (l.includes("15 min max")) {
            if (value <= 15) toFilter = true;
        }
        if (l.includes("15-30 min")) {
            if (15 <= value && value <= 30) toFilter = true;
        }
        if (l.includes("30-45 min")) {
            if (30 <= value && value <= 45) toFilter = true;
        }
        if (l.includes("45-60 min")) {
            if (45 <= value && value <= 60) toFilter = true;
        }
        if (l.includes("+ de 60 min")) {
            if (value >= 60) toFilter = true;
        }

        if (!toFilter) return true;
        else return false;
    }

    return [filterGroupElement, filterSelectedItem];
}
