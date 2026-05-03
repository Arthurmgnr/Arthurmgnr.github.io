
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
