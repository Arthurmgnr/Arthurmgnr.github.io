/**
 * ===== CalendarManager =====
 * Gère le rendu du calendrier avec optimisation (diffing)
 * Évite les rerenderages complets inutiles
 */

class CalendarManager {
  constructor(containerSelector = "#calendar") {
    this.container = document.querySelector(containerSelector);
    this.currentDays = null;
    this.lastRenderedYear = null;
    this.dayElementsCache = new Map(); // { dateKey: Element }
  }

  /**
   * Génère tous les jours pour une année (Jan-Déc + Jan de l'année suivante)
   */
  generateYear(year) {
    const days = [];
    const today = DateUtils.formatDate(new Date());
    const holidays = new Set([
      ...DateUtils.getHolidaysForYear(year),
      ...DateUtils.getHolidaysForYear(year + 1),
    ]);
    const current = new Date(year, 0, 1);

    const DAY_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];

    while (
      current.getFullYear() === year ||
      (current.getFullYear() === year + 1 && current.getMonth() === 0)
    ) {
      const dateKey = DateUtils.formatDate(current);
      const dayIndex = current.getDay();

      days.push({
        id: dateKey,
        date: new Date(current),
        letter: DAY_LETTERS[dayIndex],
        number: current.getDate(),
        isWeekend: dayIndex === 0 || dayIndex === 6,
        isPast: dateKey < today,
        isHoliday: holidays.has(dateKey),
        week: DateUtils.getISOWeekCustom(current),
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  /**
   * Crée un élément de cellule d'info
   */
  createInfoCell(className, content = "") {
    const div = document.createElement("div");
    div.className = `cell ${className}`;
    div.textContent = content;
    return div;
  }

  /**
   * Crée une partie de couche de congé
   */
  createLeavePart(leave) {
    const part = document.createElement("div");
    part.className = "leave-part";
    if (leave) {
      part.style.backgroundColor =
        AppState.leaveColors[leave.type] ||
        AppState.prevLeaveColors[leave.type] ||
        "#ccc";
      if (leave.posed) part.classList.add("is-striped");
    }
    return part;
  }

  /**
   * Met à jour la couche de congés d'un jour spécifique
   */
  renderLeaveLayer(layer, dateKey) {
    layer.innerHTML = "";
    const state = AppState.leaveState[dateKey];
    if (!state) return;

    if (state.full) {
      layer.appendChild(this.createLeavePart(state.full));
    } else {
      layer.appendChild(this.createLeavePart(state.am ?? null));
      layer.appendChild(this.createLeavePart(state.pm ?? null));
    }
  }

  /**
   * Attache les handlers de dessin à un jour
   */
  attachDrawHandlers(dayDiv, dayData) {
    const handleDraw = (event) => {
      const rect = dayDiv.getBoundingClientRect();
      const isLeft = event.clientX - rect.left < rect.width / 2;
      this.setCongeDay(dayDiv, isLeft);
      event.preventDefault();
    };

    dayDiv.addEventListener("mousedown", (event) => {
      AppState.ui.isDrawing = true;
      handleDraw(event);
    });

    dayDiv.addEventListener("mouseenter", (event) => {
      if (AppState.ui.isDrawing) handleDraw(event);
    });
  }

  /**
   * Crée l'élément DOM pour un jour
   */
  renderDay(day) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.dataset.date = day.id;

    if (day.isPast) dayDiv.classList.add("day--past");
    if (day.isWeekend) dayDiv.classList.add("day--weekend");
    if (day.isHoliday) dayDiv.classList.add("day--holiday");

    // Couche de congés
    const layer = document.createElement("div");
    layer.className = "leave-layer";
    this.renderLeaveLayer(layer, day.id);
    dayDiv.appendChild(layer);

    // Infos jour
    dayDiv.appendChild(this.createInfoCell("letter", day.letter));
    dayDiv.appendChild(this.createInfoCell("number", day.number));
    dayDiv.appendChild(this.createInfoCell("week", day.week ?? ""));

    // Indicateur vacances scolaires
    const vacation = document.createElement("div");
    vacation.className = "vacation-flag";
    if (AppState.ui.isSchoolHolidaysActive) {
      const vacYearKey = day.date.getFullYear().toString();
      if (SCHOOL_HOLIDAYS[vacYearKey]) {
        const ranges = [
          ...SCHOOL_HOLIDAYS[vacYearKey][AppState.ui.schoolHolidaysArea],
          ...SCHOOL_HOLIDAYS[vacYearKey].commun,
        ];
        if (DateUtils.isBetweenDates(day.id, ranges)) {
          vacation.classList.add("vacation-flag--active");
        }
      }
    }
    dayDiv.appendChild(vacation);

    if (!day.isWeekend && !day.isHoliday) {
      this.attachDrawHandlers(dayDiv, day);
    }

    // Mettre en cache
    this.dayElementsCache.set(day.id, dayDiv);

    return dayDiv;
  }

  /**
   * Rend le calendrier complet
   */
  render(year) {
    // Générer les jours si nécessaire
    if (this.lastRenderedYear !== year) {
      this.currentDays = this.generateYear(year);
      this.lastRenderedYear = year;
      this.dayElementsCache.clear();
    }

    const fragment = document.createDocumentFragment();
    const MONTH_NAMES = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
    ];

    // 12 mois + janvier année suivante
    for (let m = 0; m < 13; m++) {
      const targetYear = m < 12 ? year : year + 1;
      const targetMonth = m < 12 ? m : 0;

      const monthDiv = document.createElement("div");
      monthDiv.className = "month";

      const title = document.createElement("div");
      title.className = "month-title";
      title.textContent = m < 12 ? MONTH_NAMES[m] : `${MONTH_NAMES[0]} ${year + 1}`;
      monthDiv.appendChild(title);

      this.currentDays
        .filter(d => d.date.getFullYear() === targetYear && d.date.getMonth() === targetMonth)
        .forEach(day => monthDiv.appendChild(this.renderDay(day)));

      fragment.appendChild(monthDiv);
    }

    this.container.innerHTML = "";
    this.container.appendChild(fragment);
  }

  /**
   * Met à jour la couche de congés pour un jour spécifique (optimisé, pas de rerender complet)
   */
  updateDay(dateKey) {
    const dayElement = this.dayElementsCache.get(dateKey);
    if (!dayElement) {
      // Si non en cache, chercher dans le DOM
      const dayEl = document.querySelector(`[data-date="${dateKey}"]`);
      if (dayEl) {
        const layer = dayEl.querySelector(".leave-layer");
        this.renderLeaveLayer(layer, dateKey);
      }
      return;
    }

    const layer = dayElement.querySelector(".leave-layer");
    this.renderLeaveLayer(layer, dateKey);
  }

  /**
   * Pose/retire des congés sur un jour
   */
  setCongeDay(dayDiv, isLeft) {
    if (!AppState.ui.activeDayOff) return;

    const dateKey = dayDiv.dataset.date;
    const category = AppState.getCategoryByLabel(AppState.ui.activeDayOff);
    if (!dateKey || !category) return;

    // Snapshot pour revert éventuel
    const oldDateState = AppState.leaveState[dateKey]
      ? JSON.parse(JSON.stringify(AppState.leaveState[dateKey]))
      : null;
    const oldTotal = category.poses + category.planifies;

    const state = AppState.leaveState[dateKey] ?? {};

    if (AppState.ui.isLeaveActive) {
      // Mode "posé" — basculer posed sur la case existante
      const slot = AppState.ui.isHalfDayActive ? (isLeft ? "am" : "pm") : "full";
      if (state[slot]?.type === category.label) {
        state[slot].posed = !state[slot].posed;
      }
    } else if (AppState.ui.isHalfDayActive) {
      // Mode demi-journée
      const slot = isLeft ? "am" : "pm";
      delete state.full;
      if (state[slot]?.type === category.label) {
        delete state[slot];
      } else {
        state[slot] = { type: category.label, posed: false };
      }
    } else {
      // Mode journée entière
      delete state.am;
      delete state.pm;
      if (state.full?.type === category.label) {
        delete state.full;
      } else {
        state.full = { type: category.label, posed: false };
      }
    }

    // Sauvegarder ou supprimer
    if (state.full || state.am || state.pm) {
      AppState.leaveState[dateKey] = state;
    } else {
      delete AppState.leaveState[dateKey];
    }

    // Mise à jour visuelle du jour uniquement
    this.updateDay(dateKey);
    updateSummaryFromCalendar();

    // Vérification du solde
    if (!AppState.ui.isLeaveActive) {
      const newTotal = category.poses + category.planifies;
      if (newTotal > oldTotal && category.disponibles > 0) {
        if (newTotal > category.disponibles) {
          // Revert
          if (oldDateState) AppState.leaveState[dateKey] = oldDateState;
          else delete AppState.leaveState[dateKey];
          this.updateDay(dateKey);
          updateSummaryFromCalendar();
          addToast("error-not-enough-days", { congeActif: category.label });
          return;
        }
        if (newTotal === category.disponibles) {
          addToast("info-reached-days", { congeActif: category.label });
        }
      }
    }

    AppState.markDirty();
  }

  /**
   * Ajoute le listener mouseup global pour terminer le dessin
   */
  static attachGlobalHandlers() {
    document.addEventListener("mouseup", () => {
      AppState.ui.isDrawing = false;
    });
  }

  /**
   * Réinitialise le cache
   */
  clear() {
    this.currentDays = null;
    this.lastRenderedYear = null;
    this.dayElementsCache.clear();
  }
}

// Initialiser les handlers globaux
CalendarManager.attachGlobalHandlers();
