
const Toasts = {
    
    NOTIFICATION_TYPES: {
        success: { icon: "check_circle", title: "Succès" },
        error: { icon: "cancel", title: "Erreur" },
        info: { icon: "info", title: "Info" },
        warning: { icon: "error", title: "Avertissement" },
    },

    TOASTS: {
        save: { type: "success", message: "Les données ont bien été enregistrées." },
        delete: { type: "success", message: "Les données ont bien été supprimées." },
        "error-empty-category": { type: "error", message: "Il y a 1 catégorie qui ne possède pas de nom." },
        "error-empty-categories": { type: "error", message: "Il y a {nb} catégories qui ne possèdent pas de nom." },
        "error-not-enough-days": { type: "error", message: "Vous ne disposez plus de jours de congés pour la catégorie : {congeActif}." },
        "info-reached-days": { type: "info", message: "Vous venez d'atteindre votre nombre de jours de congés maximum pour la catégorie : {congeActif}." },
        "error-vacances-not-available": { type: "error", message: "Les vacances concernant l'année '{year}' ne sont pas encore disponibles." },
        "warning-vacances-partially-available": { type: "warning", message: "Les vacances concernant l'année '{year}' sont partiellement disponibles." },
        "warning-conge-already-exist": { type: "warning", message: "La catégorie '{label}' existe déjà." },
        "error-invalid-category-name": { type: "error", message: "Nom invalide : {reason}" },
    },

    addToast(toastType, variables = {}) {
        const { type, message: rawMessage } = this.TOASTS[toastType];
        if (!type) return;

        const { icon, title } = this.NOTIFICATION_TYPES[type];

        const message = Object.entries(variables).reduce(
            (msg, [key, val]) => msg.replace(`{${key}}`, val),
            rawMessage
        );

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="container-1">
                <span class="material-symbols-outlined">${icon}</span>
            </div>
            <div class="container-2">
                <p></p>
                <p></p>
            </div>
            <button class="toast-button">&times;</button>
        `;

        toast.querySelector(".container-2 p:first-child").textContent = title;
        toast.querySelector(".container-2 p:last-child").textContent = message;
        toast.querySelector(".toast-button").addEventListener("click", () => this.dismissToast(toast));

        document.querySelector(".wrapper").prepend(toast);

        if (type !== "error") {
            setTimeout(() => this.dismissToast(toast), 5000);
        } else {
            setTimeout(() => this.dismissToast(toast), 10000);
        }
    },

    dismissToast(toast) {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 500);
    },
};
