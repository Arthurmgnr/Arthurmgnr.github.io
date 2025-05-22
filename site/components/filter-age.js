
import { createFilterClick } from "/site/components/filter-click.js";

export function createFilterAge(categorie, titleElement, titleItem, items, onChange) {
    const values = createFilterClick(categorie, titleElement, titleItem, items, onChange);
    const filterGroupElement = values[0];
    const filterSelectedItem = values[1];
    const filtersActif = values[2];

    filterGroupElement.getSelected = function(value) {
        if (filtersActif.length === 0) {
            return false;
        } else {
            // if (value < parseInt(items[Math.min(...filtersActif)])) return true;
            // if (value > parseInt(items[Math.max(...filtersActif)])) return true;
            // else return false;

            // console.log(items[filtersActif[0]], value);
            let toFilter = false;
            for (let index of filtersActif) {
                if (value == items[index].replace(" et +", "")) toFilter = true;
            }

            if (!toFilter) return true;
            else return false;
        }
    }

    return [filterGroupElement, filterSelectedItem];
}
