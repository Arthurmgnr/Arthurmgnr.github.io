
const AppState = {
    // ===== État du calendrier =====
    currentYear: new Date().getFullYear(),

    // ===== Données métier =====
    categories: {}, // { [uuid]: { id, label, color, disponibles, poses, planifies, element } }
    leaveState: {}, // { [dateKey]: { full?, am?, pm? } }
    leaveColors: {}, // { [label]: colorHex }

    // ===== État hérité de l'année précédente =====
    prevLeaveColors: {}, // couleurs des catégories de l'année N-1
    prevYearDateKeys: new Set(), // dateKeys de janvier N importés depuis l'année N-1

    // ===== État UI =====
    ui: {
        isDrawing: false,
        isSchoolHolidaysActive: false,
        schoolHolidaysArea: "A",
        activeDayOff: "",
        isHalfDayActive: false,
        isLeaveActive: false,
        isHelpModalOpen: false,
        isDirty: false,
        pendingYear: null
    },

    /**
     * Réinitialise complètement l'état (changement d'année, suppression)
     */
    reset() {
        this.categories = {};
        this.leaveState = {};
        this.leaveColors = {};
        this.prevLeaveColors = {};
        this.prevYearDateKeys.clear();
        this.ui = {
            isDrawing: false,
            isSchoolHolidaysActive: false,
            schoolHolidaysArea: "A",
            activeDayOff: "",
            isHalfDayActive: false,
            isLeaveActive: false,
            isHelpModalOpen: false,
            isDirty: false,
            pendingYear: null,
        };
    },

    /**
     * Marquer comme modifié
     */
    markDirty() {
        this.ui.isDirty = true;
    },

    /**
     * Marquer comme sauvegardé
     */
    markClean() {
        this.ui.isDirty = false;
    },

    /**
     * Obtient une catégorie par ID
     */
    getCategoryById(id) {
        return this.categories[id];
    },

    /**
     * Obtient une catégorie par label
     */
    getCategoryByLabel(label) {
        return Object.values(this.categories).find(cat => cat.label === label);
    },

    /**
     * Ajoute une catégorie
     */
    addCategory(category) {
        this.categories[category.id] = category;
        if (category.label) {
            this.leaveColors[category.label] = category.color;
        }
    },

    /**
     * Supprime une catégorie
     */
    deleteCategory(id) {
        const category = this.categories[id];
        if (category) {
            delete this.categories[id];
            delete this.leaveColors[category.label];
        }
    },

    /**
     * Met à jour la couleur d'une catégorie
     */
    updateCategoryColor(label, color) {
        this.leaveColors[label] = color;
    },

    /**
     * Obtient tous les totaux (poses, planifies, disponibles)
     */
    getTotals() {
        let disponibles = 0, poses = 0, planifies = 0;
        Object.values(this.categories).forEach(cat => {
            disponibles += cat.disponibles;
            poses += cat.poses;
            planifies += cat.planifies;
        });
        return { disponibles, poses, planifies };
    },

    getDay(dateKey) {
        return this.leaveState[dateKey];
    },
};
