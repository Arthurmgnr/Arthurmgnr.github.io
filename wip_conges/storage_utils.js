
const StorageUtils = {
    /**
     * Sauvegarde les données d'une année
     */
    saveYear(year, leaveState, categories) {
        try {
            const allData = JSON.parse(localStorage.getItem("congesData") || "{}");
            allData[year] = {
                isSchoolHolidaysActive: AppState.ui.isSchoolHolidaysActive,
                schoolHolidaysArea: AppState.ui.schoolHolidaysArea,
                leaveState: JSON.parse(JSON.stringify(leaveState)),
                categories: Object.values(categories).map(({ id, label, color, disponibles, poses, planifies }) =>
                    ({ id, label, color, disponibles, poses, planifies })
                ),
            };
            localStorage.setItem("congesData", JSON.stringify(allData));
            return true;
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            return false;
        }
    },

    /**
     * Charge les données d'une année
     */
    loadYear(year) {
        try {
            const allData = JSON.parse(localStorage.getItem("congesData") || "{}");
            return allData[year] || null;
        } catch (error) {
            console.error("Erreur lors du chargement:", error);
            return null;
        }
    },

    /**
     * Charge les données de l'année précédente
     */
    loadPrevYear(year) {
        return this.loadYear(year - 1);
    },

    /**
     * Supprime les données d'une année
     */
    deleteYear(year) {
        try {
            const allData = JSON.parse(localStorage.getItem("congesData") || "{}");
            delete allData[year];
            localStorage.setItem("congesData", JSON.stringify(allData));
            return true;
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            return false;
        }
    },

    /**
     * Vérifie la disponibilité du localStorage
     */
    isAvailable() {
        try {
            const test = "__localStorage_test__";
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    },
};
