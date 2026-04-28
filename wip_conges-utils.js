/**
 * ===== Utilitaires - Dates, Validation, Storage =====
 */

// ===== DateUtils =====

const DateUtils = {
  /**
   * Format de date standard utilisé partout
   */
  FORMAT: "sv-SE",

  /**
   * Formate une date en string YYYY-MM-DD
   */
  formatDate(date) {
    return date.toLocaleDateString("sv-SE");
  },

  /**
   * Parse une date string YYYY-MM-DD et retourne un objet { year, month, day }
   */
  parseDate(dateStr) {
    const [y, m, d] = dateStr.split("-");
    return {
      year: parseInt(y),
      month: parseInt(m),
      day: parseInt(d),
    };
  },

  /**
   * Vérifie si une date est entre deux dates (inclusif)
   * @param {string} dateStr - Format YYYY-MM-DD
   * @param {Array<[string, string]>} ranges - Array de [debut, fin]
   */
  isBetweenDates(dateStr, ranges) {
    const date = dateStr.trim();
    return ranges.some(([debut, fin]) => date >= debut.trim() && date <= fin.trim());
  },

  /**
   * Calcule la date de Pâques pour une année donnée (algorithme Computus)
   */
  getEasterDate(year) {
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
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  },

  /**
   * Retourne la date de Pâques décalée de N jours
   */
  getEasterOffset(year, days) {
    const date = this.getEasterDate(year);
    date.setDate(date.getDate() + days);
    return date;
  },

  /**
   * Retourne tous les jours fériés pour une année
   */
  getHolidaysForYear(year) {
    const fixedHolidays = [
      [0, 1], [4, 1], [4, 8], [6, 14], [7, 15], [10, 1], [10, 11], [11, 25],
    ];
    return [
      ...fixedHolidays.map(([m, d]) => new Date(year, m, d).toLocaleDateString("sv-SE")),
      this.getEasterOffset(year, 1).toLocaleDateString("sv-SE"),   // Lundi de Pâques
      this.getEasterOffset(year, 39).toLocaleDateString("sv-SE"),  // Jeudi de l'Ascension
      this.getEasterOffset(year, 50).toLocaleDateString("sv-SE"),  // Lundi de Pentecôte
    ];
  },

  /**
   * Calcule le numéro de semaine ISO (avec cas spéciaux français)
   */
  getISOWeekCustom(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const getISOWeek = (dt) => {
      const temp = new Date(dt);
      temp.setDate(temp.getDate() + 3 - ((temp.getDay() + 6) % 7));
      const firstThursday = new Date(temp.getFullYear(), 0, 4);
      return 1 + Math.round(
        ((temp - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7
      );
    };

    const week = getISOWeek(d);

    // Cas standard : lundi
    if (d.getDay() === 1) {
      if (d.getMonth() === 11 && week === 1) return null;
      return week;
    }

    // Cas spécial : 1er janvier
    if (d.getMonth() === 0 && d.getDate() === 1) {
      const year = d.getFullYear();
      const jan4 = new Date(year, 0, 4);
      const week1Monday = new Date(jan4);
      week1Monday.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
      const mondayNotInJanuary = week1Monday.getMonth() !== 0;
      const isWeek1 = week === 1;
      if (mondayNotInJanuary && isWeek1) return 1;
    }

    return null;
  },
};

// ===== ValidatorUtils =====

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

// ===== StorageUtils =====

const StorageUtils = {
  /**
   * Sauvegarde les données d'une année
   */
  saveYear(year, leaveState, categories) {
    try {
      const allData = JSON.parse(localStorage.getItem("congesData") || "{}");
      allData[year] = {
        year,
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

// ===== ColorUtils =====

const ColorUtils = {
  /**
   * Génère une couleur aléatoire valide (pas grise, verte, blanche ou orange)
   */
  generateColor() {
    const randomHex = () => "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0");
    const isForbidden = (hex) => {
      const n = parseInt(hex.slice(1), 16);
      const r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
      const isGray = Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30;
      const isGreen = g > r && g > b;
      const isWhite = r > 230 && g > 230 && b > 230;
      const isOrange = r > 180 && g > 100 && b < 50;
      return isGray || isGreen || isWhite || isOrange;
    };

    let color;
    do {
      color = randomHex();
    } while (isForbidden(color));
    return color.toUpperCase();
  },

  /**
   * Convertit RGB à HEX
   */
  rgbToHex(rgb) {
    if (!rgb) return "";
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
    if (!result) return null;
    return "#" + [result[1], result[2], result[3]]
      .map(n => parseInt(n).toString(16).padStart(2, "0"))
      .join("").toUpperCase();
  },
};

// ===== LeaveUtils - Logique métier commune =====

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
