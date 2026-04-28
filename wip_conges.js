// ==================== Constantes ====================

const NOTIFICATION_TYPES = {
    success: { icon: "check_circle", title: "Succès" },
    error:   { icon: "cancel",       title: "Erreur" },
    info:    { icon: "info",          title: "Info" },
    warning: { icon: "error",         title: "Avertissement" },
};

const TOASTS = {
    "save":                                 { type: "success", message: "Les données ont bien été enregistrées." },
    "delete":                               { type: "success", message: "Les données ont bien été supprimées." },
    "error-empty-category":                 { type: "error",   message: "Il y a 1 catégorie qui ne possède pas de nom." },
    "error-empty-categories":               { type: "error",   message: "Il y a {nb} catégories qui ne possèdent pas de nom." },
    "error-not-enough-days":                { type: "error",   message: "Vous ne disposez plus de jours de congés pour la catégorie : {congeActif}." },
    "info-reached-days":                    { type: "info",    message: "Vous venez d'atteindre votre nombre de jours de congés maximum pour la catégorie : {congeActif}." },
    "error-vacances-not-available":         { type: "error",   message: "Les vacances concernant l'année '{year}' ne sont pas encore disponibles." },
    "warning-vacances-partially-available": { type: "warning", message: "Les vacances concernant l'année '{year}' sont partiellement disponibles." },
    "warning-conge-already-exist":          { type: "warning", message: "La catégorie '{label}' existe déjà." },
};

const MONTH_NAMES = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const DAY_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];

const SCHOOL_HOLIDAYS = {
    "2022": {
        A:      [["2022-02-12", "2022-02-27"], ["2022-04-16", "2022-05-01"]],
        B:      [["2022-02-05", "2022-02-20"], ["2022-04-09", "2022-04-24"]],
        C:      [["2022-02-19", "2022-03-06"], ["2022-04-23", "2022-05-08"]],
        commun: [["2022-01-01", "2022-01-02"], ["2022-05-26", "2022-05-29"], ["2022-07-08", "2022-08-31"], ["2022-10-22", "2022-11-06"], ["2022-12-17", "2022-12-31"]],
    },
    "2023": {
        A:      [["2023-02-04", "2023-02-19"], ["2023-04-08", "2023-04-23"]],
        B:      [["2023-02-11", "2023-02-26"], ["2023-04-15", "2023-04-30"]],
        C:      [["2023-02-18", "2023-03-05"], ["2023-04-22", "2023-05-07"]],
        commun: [["2023-01-01", "2023-01-01"], ["2023-05-18", "2023-05-21"], ["2023-07-08", "2023-09-03"], ["2023-10-21", "2023-11-05"], ["2023-12-23", "2023-12-31"]],
    },
    "2024": {
        A:      [["2024-02-17", "2024-03-03"], ["2024-04-13", "2024-04-28"]],
        B:      [["2024-02-24", "2024-03-10"], ["2024-04-20", "2024-05-05"]],
        C:      [["2024-02-10", "2024-02-25"], ["2024-04-06", "2024-04-21"]],
        commun: [["2024-01-01", "2024-01-07"], ["2024-05-09", "2024-05-12"], ["2024-07-06", "2024-09-01"], ["2024-10-19", "2024-11-03"], ["2024-12-21", "2024-12-31"]],
    },
    "2025": {
        A:      [["2025-02-22", "2025-03-09"], ["2025-04-19", "2025-05-04"]],
        B:      [["2025-02-08", "2025-02-23"], ["2025-04-05", "2025-04-20"]],
        C:      [["2025-02-15", "2025-03-02"], ["2025-04-12", "2025-04-27"]],
        commun: [["2025-01-01", "2025-01-05"], ["2025-05-29", "2025-06-01"], ["2025-07-05", "2025-08-31"], ["2025-10-18", "2025-11-02"], ["2025-12-20", "2025-12-31"]],
    },
    "2026": {
        A:      [["2026-02-07", "2026-02-22"], ["2026-04-04", "2026-04-19"]],
        B:      [["2026-02-14", "2026-03-01"], ["2026-04-11", "2026-04-26"]],
        C:      [["2026-02-21", "2026-03-08"], ["2026-04-18", "2026-05-03"]],
        commun: [["2026-01-01", "2026-01-04"], ["2026-05-14", "2026-05-17"], ["2026-07-04", "2026-08-31"], ["2026-10-17", "2026-11-01"], ["2026-12-19", "2026-12-31"]],
    },
    "2027": {
        A:      [["2027-02-13", "2027-02-28"], ["2027-04-10", "2027-04-25"]],
        B:      [["2027-02-20", "2027-03-07"], ["2027-04-17", "2027-05-02"]],
        C:      [["2027-02-05", "2027-02-21"], ["2027-04-03", "2027-04-18"]],
        commun: [["2027-01-01", "2027-01-03"], ["2027-05-06", "2027-05-09"]],
    },
};


// ==================== État global ====================

const categories  = {};  // { [uuid]: { id, label, color, disponibles, poses, planifies, element } }
const leaveColors = {};  // { [label]: colorHex }
const leaveState  = JSON.parse(sessionStorage.getItem("leaveState") || "{}");

let currentYear           = new Date().getFullYear();
let isSchoolHolidaysActive = false;
let isDrawing              = false;
let schoolHolidaysArea     = "A";
let activeDayOff           = "";
let isHalfDayActive        = false;
let isLeaveActive          = false;
let isHelpModalOpen        = false;
let isDirty                = false;  // modifications non enregistrées
let pendingYear            = null;   // année cible lors d'un changement avec modifs non enregistrées

const prevLeaveColors  = {};        // couleurs des catégories de l'année N-1 (pour affichage janvier N)
const prevYearDateKeys = new Set(); // dateKeys de janvier N importés depuis les données de l'année N-1


// ==================== Notifications (Toasts) ====================

function addToast(toastType, variables = {}) {
    const { type, message: rawMessage } = TOASTS[toastType];
    const { icon, title } = NOTIFICATION_TYPES[type];

    // Interpolation des variables dans le message
    const message = Object.entries(variables).reduce(
        (msg, [key, val]) => msg.replace(`{${key}}`, val),
        rawMessage,
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
    // Utiliser textContent pour éviter tout risque XSS
    toast.querySelector(".container-2 p:first-child").textContent = title;
    toast.querySelector(".container-2 p:last-child").textContent  = message;
    toast.querySelector(".toast-button").addEventListener("click", () => dismissToast(toast));

    document.querySelector(".wrapper").prepend(toast);

    if (type !== "error") {
        setTimeout(() => dismissToast(toast), 5000);
    } else {
        setTimeout(() => dismissToast(toast), 10000);
    }
}

function dismissToast(toast) {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 500);
}


// ==================== Jours fériés ====================

function getEasterDate(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day   = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

/** Retourne la date de Pâques décalée de `days` jours. */
function getEasterOffset(year, days) {
    const date = getEasterDate(year);
    date.setDate(date.getDate() + days);
    return date;
}

function getHolidaysForYear(year) {
    const fixedHolidays = [
        [0, 1], [4, 1], [4, 8], [6, 14], [7, 15], [10, 1], [10, 11], [11, 25],
    ];
    return [
        ...fixedHolidays.map(([m, d]) => new Date(year, m, d).toLocaleDateString("sv-SE")),
        getEasterOffset(year, 1).toLocaleDateString("sv-SE"),   // Lundi de Pâques
        getEasterOffset(year, 39).toLocaleDateString("sv-SE"),  // Jeudi de l'Ascension
        getEasterOffset(year, 50).toLocaleDateString("sv-SE"),  // Lundi de Pentecôte
    ];
}


// ==================== Numéros de semaine ISO ====================

function getISOWeekCustom(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  function getISOWeek(dt) {
    const temp = new Date(dt);

    temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
    const firstThursday = new Date(temp.getFullYear(), 0, 4);

    return 1 + Math.round(
      ((temp - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7
    );
  }

  const week = getISOWeek(d);

  // --- Cas standard : lundi ---
  if (d.getDay() === 1) {
    // ❌ Bloquer le cas : lundi de décembre qui appartient à semaine 1
    if (d.getMonth() === 11 && week === 1) {
      return null;
    }
    return week;
  }

  // --- Cas spécial : 1er janvier ---
  if (d.getMonth() === 0 && d.getDate() === 1) {
    const year = d.getFullYear();

    const jan4 = new Date(year, 0, 4);
    const week1Monday = new Date(jan4);
    week1Monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));

    const mondayNotInJanuary = week1Monday.getMonth() !== 0;
    const isWeek1 = week === 1;

    if (mondayNotInJanuary && isWeek1) {
      return 1;
    }
  }

  return null;
}


// ==================== Génération du calendrier ====================

function generateYear(year) {
    const days         = [];
    const today        = new Date().toLocaleDateString("sv-SE");
    const holidays     = new Set([...getHolidaysForYear(year), ...getHolidaysForYear(year + 1)]);
    const current      = new Date(year, 0, 1);
    let prevDate       = null;

    // Génère Jan–Déc de l'année + Janvier de l'année suivante
    while (current.getFullYear() === year ||
           (current.getFullYear() === year + 1 && current.getMonth() === 0)) {
        const dateKey  = current.toLocaleDateString("sv-SE");
        const dayIndex = current.getDay();

        days.push({
            id:        dateKey,
            date:      new Date(current),
            letter:    DAY_LETTERS[dayIndex],
            number:    current.getDate(),
            isWeekend: dayIndex === 0 || dayIndex === 6,
            isPast:    dateKey < today,
            isHoliday: holidays.has(dateKey),
            week:      getISOWeekCustom(current)
        });

        prevDate = new Date(current);
        current.setDate(current.getDate() + 1);
    }

    return days;
}

function createInfoCell(className, content = "") {
    const div = document.createElement("div");
    div.className = `cell ${className}`;
    div.textContent = content;
    return div;
}

/**
 * Crée un élément de couche de congé.
 * @param {{ type: string, posed: boolean } | null} leave
 */
function createLeavePart(leave) {
    const part = document.createElement("div");
    part.className = "leave-part";
    if (leave) {
        part.style.backgroundColor = leaveColors[leave.type] || prevLeaveColors[leave.type] || "#ccc";
        if (leave.posed) part.classList.add("is-striped");
    }
    return part;
}

/**
 * Remplit le leave-layer d'un jour depuis leaveState.
 * Structure : { full?, am?, pm? } — full et am/pm sont exclusifs.
 */
function renderLeaveLayer(layer, dateKey) {
    layer.innerHTML = "";
    const state = leaveState[dateKey];
    if (!state) return;
    if (state.full) {
        layer.appendChild(createLeavePart(state.full));
    } else {
        layer.appendChild(createLeavePart(state.am ?? null));
        layer.appendChild(createLeavePart(state.pm ?? null));
    }
}

function renderDay(day) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.dataset.date = day.id;

    if (day.isPast)    dayDiv.classList.add("day--past");
    if (day.isWeekend) dayDiv.classList.add("day--weekend");
    if (day.isHoliday) dayDiv.classList.add("day--holiday");

    // Couche de couleur des congés
    const layer = document.createElement("div");
    layer.className = "leave-layer";
    renderLeaveLayer(layer, day.id);
    dayDiv.appendChild(layer);

    dayDiv.appendChild(createInfoCell("letter", day.letter));
    dayDiv.appendChild(createInfoCell("number", day.number));
    dayDiv.appendChild(createInfoCell("week",   day.week ?? ""));

    // Indicateur vacances scolaires
    const vacation = document.createElement("div");
    vacation.className = "vacation-flag";
    if (isSchoolHolidaysActive) {
        const vacYearKey = day.date.getFullYear().toString();
        if (SCHOOL_HOLIDAYS[vacYearKey]) {
            const ranges = [
                ...SCHOOL_HOLIDAYS[vacYearKey][schoolHolidaysArea],
                ...SCHOOL_HOLIDAYS[vacYearKey].commun,
            ];
            if (isBetweenDates(day.id, ranges)) vacation.classList.add("vacation-flag--active");
        }
    }
    dayDiv.appendChild(vacation);

    if (!day.isWeekend && !day.isHoliday) attachDrawHandlers(dayDiv);

    return dayDiv;
}

/** Attache les événements mousedown / mouseenter pour le dessin des congés. */
function attachDrawHandlers(dayDiv) {
    const handleDraw = (event) => {
        const rect   = dayDiv.getBoundingClientRect();
        const isLeft = (event.clientX - rect.left) < rect.width / 2;
        setCongeDay(dayDiv, isLeft);
        event.preventDefault();
    };

    dayDiv.addEventListener("mousedown", (event) => {
        isDrawing = true;
        handleDraw(event);
    });
    dayDiv.addEventListener("mouseenter", (event) => {
        if (isDrawing) handleDraw(event);
    });
}

function renderCalendar(year) {
    const calendar = document.getElementById("calendar");
    const days     = generateYear(year);
    const fragment = document.createDocumentFragment();

    // 12 mois de l'année + Janvier de l'année suivante (13 colonnes)
    for (let m = 0; m < 13; m++) {
        const targetYear  = m < 12 ? year : year + 1;
        const targetMonth = m < 12 ? m    : 0;

        const monthDiv = document.createElement("div");
        monthDiv.className = "month";

        const title = document.createElement("div");
        title.className = "month-title";
        title.textContent = m < 12 ? MONTH_NAMES[m] : `${MONTH_NAMES[0]} ${year + 1}`;
        monthDiv.appendChild(title);

        days
            .filter(d => d.date.getFullYear() === targetYear && d.date.getMonth() === targetMonth)
            .forEach(day => monthDiv.appendChild(renderDay(day)));

        fragment.appendChild(monthDiv);
    }

    calendar.innerHTML = "";
    calendar.appendChild(fragment);
}

function refreshCalendar() {
    renderCalendar(currentYear);
}


// ==================== Pose des congés ====================
//
// leaveState[dateKey] = { full?, am?, pm? }
//   full : congé journée entière  — { type: string, posed: boolean }
//   am   : matinée (gauche)       — { type: string, posed: boolean }
//   pm   : après-midi (droite)    — { type: string, posed: boolean }
//   posed: true = posé (rayures), false = planifié
//   full et am/pm sont mutuellement exclusifs.

function setCongeDay(dayDiv, isLeft) {
    if (!activeDayOff) return;

    const dateKey  = dayDiv.dataset.date;
    const category = Object.values(categories).find(cat => cat.label === activeDayOff);
    if (!dateKey || !category) return;

    // Snapshot pour revert éventuel en cas de dépassement de solde
    const oldDateState = leaveState[dateKey] ? JSON.parse(JSON.stringify(leaveState[dateKey])) : null;
    const oldTotal     = category.poses + category.planifies;

    const state = leaveState[dateKey] ?? {};

    if (isLeaveActive) {
        // Mode "posé" — toggler posed sur la case existante de cette catégorie
        const slot = isHalfDayActive ? (isLeft ? "am" : "pm") : "full";
        if (state[slot]?.type === category.label) {
            state[slot].posed = !state[slot].posed;
        }
    } else if (isHalfDayActive) {
        // Mode demi-journée — basculer am ou pm
        const slot = isLeft ? "am" : "pm";
        delete state.full;                              // quitte le mode journée entière
        if (state[slot]?.type === category.label) {
            delete state[slot];                         // toggle off
        } else {
            state[slot] = { type: category.label, posed: false };
        }
    } else {
        // Mode journée entière — basculer full
        delete state.am;
        delete state.pm;                               // quitte le mode demi-journée
        if (state.full?.type === category.label) {
            delete state.full;                         // toggle off
        } else {
            state.full = { type: category.label, posed: false };
        }
    }

    // Sauvegarder ou supprimer l'entrée
    if (state.full || state.am || state.pm) {
        leaveState[dateKey] = state;
    } else {
        delete leaveState[dateKey];
    }

    // Mise à jour visuelle de ce seul jour (sans recalculer tout le calendrier)
    renderLeaveLayer(dayDiv.querySelector(".leave-layer"), dateKey);
    updateSummaryFromCalendar();

    // Vérification du solde (uniquement en mode ajout/suppression, pas en mode posé)
    if (!isLeaveActive) {
        const newTotal = category.poses + category.planifies;
        if (newTotal > oldTotal && category.disponibles > 0) {
            if (newTotal > category.disponibles) {
                // Dépassement — revert
                if (oldDateState) leaveState[dateKey] = oldDateState;
                else              delete leaveState[dateKey];
                renderLeaveLayer(dayDiv.querySelector(".leave-layer"), dateKey);
                updateSummaryFromCalendar();
                addToast("error-not-enough-days", { congeActif: category.label });
                return;
            }
            if (newTotal === category.disponibles) {
                addToast("info-reached-days", { congeActif: category.label });
            }
        }
    }

    isDirty = true;
}


// ==================== Vacances scolaires ====================

/**
 * Vérifie si les vacances scolaires sont disponibles pour l'année courante.
 * @returns {false | [true, boolean]} false si indisponible, sinon [true, isComplete]
 */
function checkIfVacancesAvailable() {
    const yearKey = currentYear.toString();
    if (!(yearKey in SCHOOL_HOLIDAYS)) return false;
    return [true, SCHOOL_HOLIDAYS[yearKey].commun.length === 5];
}

function toggleSchoolHolidays() {
    const checkbox = document.getElementById("school-holiday");
    if (checkbox.checked) {
        const available = checkIfVacancesAvailable();
        if (available === false) {
            checkbox.checked = false;
            addToast("error-vacances-not-available", { year: currentYear });
        } else {
            if (!available[1]) addToast("warning-vacances-partially-available", { year: currentYear });
            isSchoolHolidaysActive = true;
            refreshCalendar();
        }
    } else {
        isSchoolHolidaysActive = false;
        refreshCalendar();
    }
    schoolHolidaysArea = document.getElementById("zone-select").value;
}


// ==================== Utilitaire dates ====================

function isBetweenDates(dateStr, plages) {
    const [y, m, d] = dateStr.split("-");
    const date = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    return plages.some(([debut, fin]) => date >= debut.trim() && date <= fin.trim());
}


// ==================== Fenêtre d'aide ====================

function showHelpModal() {
    isHelpModalOpen = !isHelpModalOpen;
    document.getElementById("helpModal").style.display = isHelpModalOpen ? "flex" : "none";
}


// ==================== Résumé des congés ====================

function updateCategory(category) {
    const el = category.element;
    category.disponibles = parseInt(el.querySelector(`#disponibles${category.label}`).value, 10);

    const soldeReel = category.disponibles - category.poses;
    const soldePrev = soldeReel - category.planifies;

    el.querySelector(`#poses${category.label}`).textContent             = category.poses;
    el.querySelector(`#soldeReel${category.label}`).textContent         = soldeReel;
    el.querySelector(`#planifies${category.label}`).textContent         = category.planifies;
    el.querySelector(`#soldePrevisionnel${category.label}`).textContent = soldePrev;

    updateTotals();
}

function updateTotals() {
    let disponibles = 0, poses = 0, planifies = 0;

    Object.values(categories).forEach(cat => {
        disponibles += cat.disponibles;
        poses       += cat.poses;
        planifies   += cat.planifies;
    });

    const soldeReel = disponibles - poses;
    const soldePrev = soldeReel - planifies;

    document.getElementById("disponiblesSum").textContent       = disponibles;
    document.getElementById("posesSum").textContent             = poses;
    document.getElementById("planifiesSum").textContent         = planifies;
    document.getElementById("soldeReelSum").textContent         = soldeReel;
    document.getElementById("soldePrevisionnelSum").textContent = soldePrev;
}

/** Ajoute `amount` jours à la catégorie correspondante (posé ou planifié). */
function accumulateLeave(leave, amount) {
    const category = Object.values(categories).find(cat => cat.label === leave.type);
    if (!category) return;
    if (leave.posed) category.poses     += amount;
    else             category.planifies += amount;
}

function updateSummaryFromCalendar() {
    // Remettre à zéro les compteurs
    Object.values(categories).forEach(cat => { cat.poses = 0; cat.planifies = 0; });

    // Les entrées de janvier N importées depuis l'année N-1 ne comptent pas dans le quota de l'année N
    Object.entries(leaveState).forEach(([dateKey, state]) => {
        if (prevYearDateKeys.has(dateKey)) return;
        if (state.full)        accumulateLeave(state.full, 1);
        if (state.am)          accumulateLeave(state.am,   0.5);
        if (state.pm)          accumulateLeave(state.pm,   0.5);
    });

    // Mettre à jour l'affichage de chaque catégorie
    Object.values(categories).forEach(cat => {
        if (!cat.element) return;
        cat.poses     = Math.round(cat.poses     * 10) / 10;
        cat.planifies = Math.round(cat.planifies * 10) / 10;
        const soldeReel = cat.disponibles - cat.poses;
        cat.element.querySelector(`#poses${cat.label}`).textContent             = cat.poses;
        cat.element.querySelector(`#soldeReel${cat.label}`).textContent         = soldeReel;
        cat.element.querySelector(`#planifies${cat.label}`).textContent         = cat.planifies;
        cat.element.querySelector(`#soldePrevisionnel${cat.label}`).textContent = soldeReel - cat.planifies;
    });

    updateTotals();
    updatePrevYearJanuarySummary();
}

function updatePrevYearJanuarySummary() {
    const section = document.getElementById("prev-year-january-section");
    if (!section) return;

    if (prevYearDateKeys.size === 0) {
        section.style.display = "none";
        return;
    }

    // Comptage des jours par type de catégorie
    const counts = {};
    const accumulate = (leave, amount) => {
        if (!leave) return;
        if (!counts[leave.type]) {
            counts[leave.type] = { color: prevLeaveColors[leave.type] || "#ccc", poses: 0, planifies: 0 };
        }
        if (leave.posed) counts[leave.type].poses     += amount;
        else             counts[leave.type].planifies += amount;
    };
    prevYearDateKeys.forEach(dateKey => {
        const state = leaveState[dateKey];
        if (!state) return;
        if (state.full) {
            accumulate(state.full, 1);
        } else {
            accumulate(state.am, 0.5);
            accumulate(state.pm, 0.5);
        }
    });
    Object.values(counts).forEach(c => {
        c.poses     = Math.round(c.poses     * 10) / 10;
        c.planifies = Math.round(c.planifies * 10) / 10;
    });

    // Mise à jour des labels
    document.getElementById("prev-jan-year-label").textContent       = currentYear;
    document.getElementById("prev-jan-quota-year-label").textContent = currentYear - 1;

    // Construction des lignes
    const tbody = document.getElementById("prev-year-january-tbody");
    tbody.innerHTML = "";
    Object.entries(counts).forEach(([type, data]) => {
        const tr = document.createElement("tr");

        const tdColor = document.createElement("td");
        tdColor.className = "noBorder prev-year-color-cell";
        tdColor.style.backgroundColor = data.color;

        const tdLabel = document.createElement("th");
        tdLabel.textContent = type;

        const tdPoses = document.createElement("td");
        tdPoses.textContent = data.poses;

        const tdPlanifies = document.createElement("td");
        tdPlanifies.textContent = data.planifies;

        tr.append(tdColor, tdLabel, tdPoses, tdPlanifies);
        tbody.appendChild(tr);
    });
    section.style.display = "block";
}


// ==================== Catégories ====================

function generateColor() {
    const randomHex   = () => "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0");
    const isForbidden = (hex) => {
        const n = parseInt(hex.slice(1), 16);
        const r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
        const isGray   = Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30;
        const isGreen  = g > r && g > b;
        const isWhite  = r > 230 && g > 230 && b > 230;
        const isOrange = r > 180 && g > 100 && b < 50;
        return isGray || isGreen || isWhite || isOrange;
    };

    let color;
    do { color = randomHex(); } while (isForbidden(color));
    return color.toUpperCase();
}

function addCategory(label = "", disponibles = 0, poses = 0, planifies = 0, first = true) {
    const id       = crypto.randomUUID();
    const category = { id, label, color: generateColor(), disponibles, poses, planifies, element: null };
    categories[id] = category;
    if (label) leaveColors[label] = category.color;
    createCategoryRow(category, first);
}

function createCategoryRow(category, first) {
    const tbody = document.querySelector(".congesSummary tbody");
    const tr    = document.createElement("tr");
    tr.dataset.id = category.id;

    tr.innerHTML = `
        <td class="noBorder">
            <button class="delete-category" title="Supprimer la catégorie ainsi que les jours posés dans le calendrier">
                <span class="material-symbols-outlined">do_not_disturb_on</span>Catégorie
            </button>
            <button class="edit-category" title="Modifier le nom de la catégorie">
                <span class="material-symbols-outlined">edit</span>Catégorie
            </button>
        </td>
        <th>
            <span class="category-label"></span>&nbsp;
            <input class="category-color-picker" type="color" value="${category.color}" title="Modifier la couleur de la catégorie">
        </th>
        <td><input value="${category.disponibles}" type="number" id="disponibles${category.label}" min="0" max="50"></td>
        <td id="poses${category.label}">0</td>
        <td id="planifies${category.label}">0</td>
        <td id="soldeReel${category.label}">0</td>
        <td id="soldePrevisionnel${category.label}">0</td>
        <td class="noBorder">
            <button class="delete-category-days" title="Supprimer les jours posés dans le calendrier appartenant à cette catégorie">
                <span class="material-symbols-outlined">ink_eraser</span>Congés
            </button>
        </td>
    `;

    // Assigner le label via textContent (sécurité XSS)
    tr.querySelector(".category-label").textContent = category.label;

    tr.querySelector(".delete-category")     .addEventListener("click", () => { deleteCategory(category.id); isDirty = true; });
    tr.querySelector(".edit-category")        .addEventListener("click", () => updateCategoryLabel(category, false));
    tr.querySelector(".category-color-picker").addEventListener("change", () => { setCongeColor(category); isDirty = true; });
    tr.querySelector(".delete-category-days") .addEventListener("click", () => { deleteCongeCategory(category.id, category.label); isDirty = true; });
    tr.querySelector(`#disponibles${category.label}`).addEventListener("change", () => { updateCategory(category); isDirty = true; });

    category.element = tr;
    tbody.insertBefore(tr, tbody.children[tbody.children.length - 1]);

    if (first)  updateCategoryLabel(category, true);
    if (!first) addCongesSelector(category, category.label);
    updateCategory(category);
}

function updateCategoryLabel(category, first) {
    const span         = category.element.querySelector(".category-label");
    const valeurActuelle = span.innerText.trim();
    const input        = document.createElement("input");
    input.type  = "text";
    input.value = valeurActuelle;

    const onConfirm = (event) => {
        const newValue = convertLabel(event, category, input, valeurActuelle, span);
        if (first) addCongesSelector(category, newValue);
    };

    input.onblur    = onConfirm;
    input.onkeypress = (event) => { if (event.key === "Enter") onConfirm(event); };

    span.innerHTML = "";
    span.appendChild(input);
    input.focus();
}

function convertLabel(event, category, input, valeurActuelle, span) {
    const newValue = input.value.trim().toUpperCase().replaceAll(" ", "_");

    if (valeurActuelle !== newValue) {
        if (!checkCongeValide(newValue)) {
            event.target.focus();
        } else {
            // Mettre à jour tous les IDs qui contiennent l'ancien label
            ["disponibles", "poses", "soldeReel", "planifies", "soldePrevisionnel"].forEach(prefix => {
                const el = category.element.querySelector(`#${prefix}${category.label}`);
                if (el) el.id = `${prefix}${newValue}`;
            });
            span.innerText  = newValue;
            category.label  = newValue;
            updateCongeSelector(valeurActuelle, newValue, category);
            isDirty = true;
        }
    } else {
        span.innerText = valeurActuelle;
    }

    return newValue;
}

function checkCongeValide(newValue) {
    if (!newValue) return false;
    if (Object.values(categories).some(cat => cat.label === newValue)) {
        addToast("warning-conge-already-exist", { label: newValue });
        return false;
    }
    return true;
}

function setCongeColor(category) {
    const th    = category.element.querySelector("th");
    const conge = th.querySelector(".category-label").innerText;
    category.color = th.querySelector(".category-color-picker").value.toUpperCase();

    delete leaveColors[conge];
    leaveColors[conge] = category.color;

    // Mettre à jour la surbrillance du sélecteur actif
    document.querySelectorAll("[id^='top']").forEach(elt => {
        elt.style.backgroundColor = elt.id.includes(conge) ? category.color : "";
    });

    refreshCalendar();
}

function addCongesSelector(category, label) {
    const el = document.createElement("div");
    el.className   = "selectionConge";
    el.id          = `top${label}`;
    el.textContent = label;
    el.addEventListener("click", () => toggleActiveDayOff(el, category));
    leaveColors[label] = category.color;
    document.getElementById("conges-selector").appendChild(el);
}

function updateCongeSelector(oldValue, newValue, category) {
    const el = document.getElementById(`top${oldValue}`);
    if (el) {
        el.id          = `top${newValue}`;
        el.textContent = newValue;
        toggleActiveDayOff(el, category);
    }
}

function toggleActiveDayOff(elt, category) {
    const isActive = rgbToHex(elt.style.backgroundColor) === category.color;
    elt.style.backgroundColor = isActive ? "" : category.color;
    activeDayOff = isActive ? "" : category.label;

    // Désactiver tous les autres sélecteurs
    document.querySelectorAll("[id^='top']").forEach(el => {
        if (el !== elt) el.style.backgroundColor = "";
    });
}

function deleteCategory(id) {
    const category = categories[id];
    if (!category) return;

    deleteCongeCategory(id, category.label);
    document.getElementById(`top${category.label}`)?.remove();
    category.element.remove();
    delete categories[id];
    delete leaveColors[category.label];

    updateTotals();
}

function deleteCongeCategory(categoryId, categoryLabel) {
    const category = categories[categoryId];
    if (!category) return;

    Object.keys(leaveState).forEach(dateKey => {
        const state = leaveState[dateKey];
        ["full", "am", "pm"].forEach(slot => {
            if (state[slot]?.type === categoryLabel) delete state[slot];
        });
        if (!state.full && !state.am && !state.pm) delete leaveState[dateKey];
    });

    refreshCalendar();
    updateSummaryFromCalendar();
    addToast("delete");
}


// ==================== Utilitaire couleur ====================

function rgbToHex(rgb) {
    if (!rgb) return "";
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
    if (!result) return null;
    return "#" + [result[1], result[2], result[3]]
        .map(n => parseInt(n).toString(16).padStart(2, "0"))
        .join("").toUpperCase();
}


// ==================== Sauvegarde / Chargement ====================

/** Réinitialise l'état et l'interface (facteur commun de loadYearData et confirmSave). */
function resetUIState() {
    Object.keys(leaveState).forEach(k  => delete leaveState[k]);
    Object.keys(categories).forEach(k  => delete categories[k]);
    Object.keys(leaveColors).forEach(k => delete leaveColors[k]);

    // Supprimer les lignes de catégories du tableau (garder header + total uniquement)
    const tbody = document.querySelector(".congesSummary tbody");
    while (tbody.children.length > 2) tbody.children[1].remove();

    document.getElementById("conges-selector").innerHTML  = "";
    document.getElementById("half-day").checked           = false;
    document.getElementById("leave").checked              = false;
    document.getElementById("school-holiday").checked     = false;
    isHalfDayActive        = false;
    isLeaveActive          = false;
    activeDayOff           = "";
    isSchoolHolidaysActive = false;
    isDirty                = false;

    // Réinitialiser l'état hérité de l'année précédente
    Object.keys(prevLeaveColors).forEach(k => delete prevLeaveColors[k]);
    prevYearDateKeys.clear();
    const prevSection = document.getElementById("prev-year-january-section");
    if (prevSection) prevSection.style.display = "none";

    // Réinitialiser les totaux du résumé
    ["disponiblesSum", "posesSum", "planifiesSum", "soldeReelSum", "soldePrevisionnelSum"]
        .forEach(id => { document.getElementById(id).textContent = "0"; });
}

function saveYear() {
    const emptyCats = Object.values(categories).filter(cat => !cat.label);
    if (emptyCats.length > 0) {
        const key = emptyCats.length === 1 ? "error-empty-category" : "error-empty-categories";
        addToast(key, { nb: emptyCats.length });
        return false;
    }

    const allData = JSON.parse(localStorage.getItem("congesData") || "{}");
    allData[currentYear] = {
        year:       currentYear,
        leaveState: JSON.parse(JSON.stringify(leaveState)),
        categories: Object.values(categories).map(({ id, label, color, disponibles, poses, planifies }) =>
            ({ id, label, color, disponibles, poses, planifies }),
        ),
    };
    localStorage.setItem("congesData", JSON.stringify(allData));
    isDirty = false;
    addToast("save");
    return true;
}

function deleteYear() {
    document.getElementById("deleteConfirm").style.display = "flex";
}

function confirmDelete(confirmed) {
    document.getElementById("deleteConfirm").style.display = "none";
    if (!confirmed) return;

    const allData = JSON.parse(localStorage.getItem("congesData") || "{}");
    delete allData[currentYear];
    localStorage.setItem("congesData", JSON.stringify(allData));

    resetUIState();
    refreshCalendar();
    addToast("delete");
}

/** Change d'année après confirmation éventuelle des modifs non enregistrées. */
function changeYear(newYear) {
    newYear = parseInt(newYear) || new Date().getFullYear();
    if (newYear < 2000 || newYear > 2050 || newYear === currentYear) return;

    if (isDirty) {
        pendingYear = newYear;
        document.getElementById("year").value = currentYear;  // revert l'affichage
        document.getElementById("customConfirm").style.display = "flex";
        return;
    }

    applyYearChange(newYear);
}

function applyYearChange(year) {
    currentYear = year;
    document.getElementById("year").value            = currentYear;
    document.getElementById("year").dataset.oldValue = currentYear;
    loadYearData(currentYear);
}

function loadYearData(year) {
    const allData  = JSON.parse(localStorage.getItem("congesData") || "{}");
    const yearData = allData[year];
    const prevData = allData[year - 1];

    resetUIState();

    if (yearData) {
        Object.assign(leaveState, yearData.leaveState);
        yearData.categories.forEach(catData => {
            addCategory(catData.label, catData.disponibles, catData.poses, catData.planifies, false);
            const catId = Object.keys(categories).find(id => categories[id].label === catData.label);
            const cat   = categories[catId];
            if (cat) {
                cat.color = catData.color;
                leaveColors[catData.label] = catData.color;
                cat.element?.querySelector(".category-color-picker")?.setAttribute("value", catData.color);
            }
        });
    }

    // Récupérer les congés de janvier N depuis les données sauvegardées de l'année N-1
    // (ils ont pu être posés en affichant l'année N-1 qui montre aussi janvier N)
    if (prevData?.leaveState) {
        // Mémoriser les couleurs de l'année N-1 pour afficher ces jours avec la bonne couleur
        if (prevData.categories) {
            prevData.categories.forEach(cat => { prevLeaveColors[cat.label] = cat.color; });
        }
        const januaryPrefix = `${year}-01-`;
        Object.entries(prevData.leaveState).forEach(([dateKey, state]) => {
            if (dateKey.startsWith(januaryPrefix) && !leaveState[dateKey]) {
                leaveState[dateKey] = JSON.parse(JSON.stringify(state));
                prevYearDateKeys.add(dateKey);
            }
        });
    }

    refreshCalendar();
    updatePrevYearJanuarySummary();
}


// ==================== Initialisation ====================

function init() {
    const yearInput = document.getElementById("year");
    yearInput.value            = currentYear;
    yearInput.dataset.oldValue = currentYear;

    // Actions principales
    document.querySelector(".save")  .addEventListener("click", saveYear);
    document.querySelector(".delete").addEventListener("click", deleteYear);
    document.querySelector(".help")  .addEventListener("click", showHelpModal);

    // Navigation année
    yearInput.addEventListener("change", (e) => changeYear(e.target.value));
    document.querySelector(".plus") .addEventListener("click", () => changeYear(currentYear + 1));
    document.querySelector(".minus").addEventListener("click", () => changeYear(currentYear - 1));

    // Vacances scolaires
    document.getElementById("school-holiday").addEventListener("click", toggleSchoolHolidays);

    // Options de pose
    document.getElementById("half-day").addEventListener("click", (e) => { isHalfDayActive = e.target.checked; });
    document.getElementById("leave")   .addEventListener("click", (e) => { isLeaveActive   = e.target.checked; });

    // Catégories
    document.querySelector(".add-category").addEventListener("click", () => { addCategory(); isDirty = true; });

    // Modale « modifications non enregistrées » (customConfirm)
    document.querySelector("#customConfirm .md-not-save").addEventListener("click", () => {
        document.getElementById("customConfirm").style.display = "none";
        if (pendingYear !== null) {
            const y = pendingYear; pendingYear = null;
            applyYearChange(y);
        }
    });
    document.querySelector("#customConfirm .md-cancel").addEventListener("click", () => {
        document.getElementById("customConfirm").style.display = "none";
        document.getElementById("year").value = currentYear;  // revert l'affichage
        pendingYear = null;
    });
    document.querySelector("#customConfirm .md-save").addEventListener("click", () => {
        document.getElementById("customConfirm").style.display = "none";
        if (pendingYear !== null) {
            const y = pendingYear; pendingYear = null;
            if (saveYear()) applyYearChange(y);
            else            document.getElementById("year").value = currentYear;
        }
    });

    // Modale « confirmation de suppression » (deleteConfirm)
    document.querySelector("#deleteConfirm .md-confirm").addEventListener("click", () => confirmDelete(true));
    document.querySelector("#deleteConfirm .md-cancel") .addEventListener("click", () => confirmDelete(false));

    document.querySelector("#helpModal .md-cancel").addEventListener("click", showHelpModal);

    // Raccourci clavier pour fermer l'aide
    document.addEventListener("keypress", (e) => { if (isHelpModalOpen && e.key === "Escape") showHelpModal(); });

    // Fin du tracé de congés
    document.addEventListener("mouseup", () => { isDrawing = false; });

    // Chargement initial
    loadYearData(currentYear);
    renderCalendar(currentYear);
}

init();
