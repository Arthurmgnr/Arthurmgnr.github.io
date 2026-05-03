
const SchoolHolidays = {

    SCHOOL_HOLIDAYS: {
        "2022": {
            A: [["2022-02-12", "2022-02-27"], ["2022-04-16", "2022-05-01"]],
            B: [["2022-02-05", "2022-02-20"], ["2022-04-09", "2022-04-24"]],
            C: [["2022-02-19", "2022-03-06"], ["2022-04-23", "2022-05-08"]],
            commun: [["2022-01-01", "2022-01-02"], ["2022-05-26", "2022-05-29"], ["2022-07-08", "2022-08-31"], ["2022-10-22", "2022-11-06"], ["2022-12-17", "2022-12-31"]],
        },
        "2023": {
            A: [["2023-02-04", "2023-02-19"], ["2023-04-08", "2023-04-23"]],
            B: [["2023-02-11", "2023-02-26"], ["2023-04-15", "2023-04-30"]],
            C: [["2023-02-18", "2023-03-05"], ["2023-04-22", "2023-05-07"]],
            commun: [["2023-01-01", "2023-01-01"], ["2023-05-18", "2023-05-21"], ["2023-07-08", "2023-09-03"], ["2023-10-21", "2023-11-05"], ["2023-12-23", "2023-12-31"]],
        },
        "2024": {
            A: [["2024-02-17", "2024-03-03"], ["2024-04-13", "2024-04-28"]],
            B: [["2024-02-24", "2024-03-10"], ["2024-04-20", "2024-05-05"]],
            C: [["2024-02-10", "2024-02-25"], ["2024-04-06", "2024-04-21"]],
            commun: [["2024-01-01", "2024-01-07"], ["2024-05-09", "2024-05-12"], ["2024-07-06", "2024-09-01"], ["2024-10-19", "2024-11-03"], ["2024-12-21", "2024-12-31"]],
        },
        "2025": {
            A: [["2025-02-22", "2025-03-09"], ["2025-04-19", "2025-05-04"]],
            B: [["2025-02-08", "2025-02-23"], ["2025-04-05", "2025-04-20"]],
            C: [["2025-02-15", "2025-03-02"], ["2025-04-12", "2025-04-27"]],
            commun: [["2025-01-01", "2025-01-05"], ["2025-05-29", "2025-06-01"], ["2025-07-05", "2025-08-31"], ["2025-10-18", "2025-11-02"], ["2025-12-20", "2025-12-31"]],
        },
        "2026": {
            A: [["2026-02-07", "2026-02-22"], ["2026-04-04", "2026-04-19"]],
            B: [["2026-02-14", "2026-03-01"], ["2026-04-11", "2026-04-26"]],
            C: [["2026-02-21", "2026-03-08"], ["2026-04-18", "2026-05-03"]],
            commun: [["2026-01-01", "2026-01-04"], ["2026-05-14", "2026-05-17"], ["2026-07-04", "2026-08-31"], ["2026-10-17", "2026-11-01"], ["2026-12-19", "2026-12-31"]],
        },
        "2027": {
            A: [["2027-02-13", "2027-02-28"], ["2027-04-10", "2027-04-25"]],
            B: [["2027-02-20", "2027-03-07"], ["2027-04-17", "2027-05-02"]],
            C: [["2027-02-05", "2027-02-21"], ["2027-04-03", "2027-04-18"]],
            commun: [["2027-01-01", "2027-01-03"], ["2027-05-06", "2027-05-09"]],
        },
    },

    checkIfVacancesAvailable() {
        const yearKey = AppState.currentYear.toString();
        if (!(yearKey in SchoolHolidays.SCHOOL_HOLIDAYS)) return false;
        return [true, SchoolHolidays.SCHOOL_HOLIDAYS[yearKey].commun.length === 5];
    },

    toggleSchoolHolidays() {
        const checkbox = document.getElementById("school-holiday");
        if (checkbox.checked) {
            const available = SchoolHolidays.checkIfVacancesAvailable();
            if (available === false) {
                checkbox.checked = false;
                Toasts.addToast("error-vacances-not-available", { year: AppState.currentYear });
            } else {
                if (!available[1]) {
                    Toasts.addToast("warning-vacances-partially-available", { year: AppState.currentYear });
                }
                AppState.ui.isSchoolHolidaysActive = true;
                calendarManager.render(AppState.currentYear);
            }
        } else {
            AppState.ui.isSchoolHolidaysActive = false;
            calendarManager.render(AppState.currentYear);
        }
        AppState.ui.schoolHolidaysArea = document.getElementById("zone-select").value;
    },

    updateVacances() {
        AppState.ui.schoolHolidaysArea = document.getElementById("zone-select").value;
        if (AppState.ui.isSchoolHolidaysActive) calendarManager.render(AppState.currentYear);
    },
};
