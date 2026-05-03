
const LeaveUtils = {
    /**
     * Arrondit les jours (demi-jours = 0.5)
     */
    roundDays(days) {
        return Math.round(days * 10) / 10;
    },

    /**
     * Accumule les jours pour une catégorie (logique extraite et réutilisable)
     * @param {Object} leave - { type, posed }
     * @param {number} amount - Nombre de jours (1 ou 0.5)
     * @param {Object} counts - Objet { [categoryLabel]: { poses, planifies } }
     * @param {Object} colorMap - Map des couleurs
     */
    accumulateLeave(leave, amount, counts, colorMap = {}) {
        if (!leave) return;

        if (!counts[leave.type]) {
            counts[leave.type] = {
                color: colorMap[leave.type] || "#ccc",
                poses: 0,
                planifies: 0,
            };
        }

        if (leave.posed) {
            counts[leave.type].poses += amount;
        } else {
            counts[leave.type].planifies += amount;
        }
    },

    /**
     * Accumule tous les congés d'un leaveState vers des compteurs
     * Utilise la même logique partout
     */
    accumulateAllLeaves(leaveState, excludeKeys = null, colorMap = {}) {
        const counts = {};

        Object.entries(leaveState).forEach(([dateKey, state]) => {
            if (excludeKeys && excludeKeys.has(dateKey)) return;
            if (!state) return;

            if (state.full) {
                this.accumulateLeave(state.full, 1, counts, colorMap);
            } else {
                this.accumulateLeave(state.am, 0.5, counts, colorMap);
                this.accumulateLeave(state.pm, 0.5, counts, colorMap);
            }
        });

        // Arrondir tous les résultats
        Object.values(counts).forEach(c => {
            c.poses = this.roundDays(c.poses);
            c.planifies = this.roundDays(c.planifies);
        });

        return counts;
    },

    /**
     * Accumule les congés pour chaque catégorie directement depuis l'état
     */
    updateCategoryCounts(leaveState, categories, excludeKeys = null) {
        // Remettre à zéro
        Object.values(categories).forEach(cat => {
            cat.poses = 0;
            cat.planifies = 0;
        });

        // Accumuler
        Object.entries(leaveState).forEach(([dateKey, state]) => {
            if (excludeKeys && excludeKeys.has(dateKey)) return;
            if (!state) return;

            const accumulate = (leave, amount) => {
                if (!leave) return;
                const cat = Object.values(categories).find(c => c.label === leave.type);
                if (cat) {
                    if (leave.posed) cat.poses += amount;
                    else cat.planifies += amount;
                }
            };

            if (state.full) {
                accumulate(state.full, 1);
            } else {
                accumulate(state.am, 0.5);
                accumulate(state.pm, 0.5);
            }
        });

        // Arrondir
        Object.values(categories).forEach(cat => {
            cat.poses = this.roundDays(cat.poses);
            cat.planifies = this.roundDays(cat.planifies);
        });
    },
};
