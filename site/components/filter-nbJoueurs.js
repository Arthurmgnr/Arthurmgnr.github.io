
import { createFilterClick } from "/site/components/filter-click.js";

export function createFilterNbJoueurs(categorie, titleElement, titleItem, items, onChange) {
    const values = createFilterClick(categorie, titleElement, titleItem, items, onChange);
    const filterGroupElement = values[0];
    const filterSelectedItem = values[1];
    const filtersActif = values[2];

    filterGroupElement.getSelected = function(value) {
        let l = [];
        filtersActif.forEach(index => l.push(items[index]));
        if (l.length === 0) return false;
        let toFilter = false;
        items.forEach(item => {
            if (l.includes(item) && value !== "1+") {
                if (item === "1" || item === "2") {
                    if (l.includes(item)) {
                        if (value === item) toFilter = true;
                    }
                } else {
                    const nbJoueurs = parseInt(item.replace(" et +", ""));
                    const minGameNbJoueurs = parseInt(value.split("-")[0]);
                    const maxGameNbJoueurs = parseInt(value.split("-")[1]);
                    if ((minGameNbJoueurs <= nbJoueurs) && (nbJoueurs <= maxGameNbJoueurs)) toFilter = true;
                }
            }
        });
        if (value === "1+") toFilter = true;

        if (!toFilter) return true;
        else return false;
    }

    return [filterGroupElement, filterSelectedItem];
}
