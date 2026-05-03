
const ValidatorUtils = {
    /**
     * Valide un nom de catégorie (lettres, chiffres, tirets, underscores uniquement)
     * @returns {true | string} true si valide, sinon message d'erreur
     */
    validateCategoryName(name) {
        if (!name || !name.trim()) {
            return "Le nom ne peut pas être vide";
        }
        
        // Accepter uniquement lettres, chiffres, tirets, underscores, espaces
        if (!/^[a-zA-Z0-9\-_\s]+$/.test(name)) {
            return "Le nom ne peut contenir que des lettres, chiffres, tirets et underscores";
        }

        return true;
    },

    /**
     * Vérifie si une catégorie existe déjà
     */
    categoryExists(label, excludeId = null) {
        return Object.values(AppState.categories).some(
            cat => cat.label === label && cat.id !== excludeId
        );
    },

    /**
     * Normalise le nom d'une catégorie (majuscules, underscores au lieu d'espaces)
     */
    normalizeCategoryName(name) {
        return name.trim().toUpperCase().replaceAll(" ", "_");
    },

    /**
     * Valide un nombre de jours
     */
    validateDays(value) {
        const num = parseInt(value, 10);
        if (isNaN(num)) return false;
        if (num < 0 || num > 50) return false;
        return true;
    },
};
