
// ===== Instance du gestionnaire de calendrier =====
let calendarManager = null;

// ===== Sauvegarde / Chargement =====

function resetUIState() {
    // Object.keys(AppState.leaveState).forEach(k => delete AppState.leaveState[k]);
    // Object.keys(AppState.categories).forEach(k => delete AppState.categories[k]);
    // Object.keys(AppState.leaveColors).forEach(k => delete AppState.leaveColors[k]);
    AppState.reset();

    const tbody = document.querySelector(".congesSummary tbody");
    while (tbody.children.length > 2) tbody.children[1].remove();

    document.getElementById("conges-selector").innerHTML = "";
    document.getElementById("half-day").checked = false;
    document.getElementById("leave").checked = false;
    document.getElementById("school-holiday").checked = false;
    document.getElementById("zone-select").value = "A";
    
    // AppState.ui.isHalfDayActive = false;
    // AppState.ui.isLeaveActive = false;
    // AppState.ui.activeDayOff = "";
    // AppState.ui.isSchoolHolidaysActive = false;
    // AppState.ui.isDirty = false;

    // Object.keys(AppState.prevLeaveColors).forEach(k => delete AppState.prevLeaveColors[k]);
    // AppState.prevYearDateKeys.clear();
    
    const prevSection = document.getElementById("prev-year-january-section");
    if (prevSection) prevSection.style.display = "none";

    ["disponiblesSum", "posesSum", "planifiesSum", "soldeReelSum", "soldePrevisionnelSum"]
        .forEach(id => { document.getElementById(id).textContent = "0"; });
}

function saveYear() {
    const emptyCats = Object.values(AppState.categories).filter(cat => !cat.label);
    if (emptyCats.length > 0) {
        const key = emptyCats.length === 1 ? "error-empty-category" : "error-empty-categories";
        Toasts.addToast(key, { nb: emptyCats.length });
        return false;
    }

    if (!StorageUtils.saveYear(AppState.currentYear, AppState.leaveState, AppState.categories)) return false;

    AppState.ui.isDirty = false;
    Toasts.addToast("save");
    return true;
}

function deleteYear() {
    document.getElementById("deleteConfirm").style.display = "flex";
}

function confirmDelete(confirmed) {
    document.getElementById("deleteConfirm").style.display = "none";
    if (!confirmed) return;

    if (!StorageUtils.deleteYear(AppState.currentYear)) return;

    resetUIState();
    calendarManager.render(AppState.currentYear);
    Toasts.addToast("delete");
}

function changeYear(newYear) {
    newYear = parseInt(newYear) || new Date().getFullYear();
    if (newYear < 2000 || newYear > 2050 || newYear === AppState.currentYear) return;

    if (AppState.ui.isDirty) {
        AppState.ui.pendingYear = newYear;
        document.getElementById("year").value = AppState.currentYear;
        document.getElementById("customConfirm").style.display = "flex";
        return;
    }

    applyYearChange(newYear);
}

function applyYearChange(year) {
    AppState.currentYear = year;
    document.getElementById("year").value = AppState.currentYear;
    document.getElementById("year").dataset.oldValue = AppState.currentYear;
    loadYearData(AppState.currentYear);
}

function loadYearData(year) {
    const yearData = StorageUtils.loadYear(year);
    const prevData = StorageUtils.loadYear(year - 1);

    resetUIState();

    if (yearData) {
        AppState.ui.isSchoolHolidaysActive = yearData.isSchoolHolidaysActive;
        document.getElementById("school-holiday").checked = yearData.isSchoolHolidaysActive;
        AppState.ui.schoolHolidaysArea = yearData.schoolHolidaysArea;
        document.getElementById("zone-select").value = yearData.schoolHolidaysArea;
        Object.assign(AppState.leaveState, yearData.leaveState);
        yearData.categories.forEach(catData => {
            addCategory(catData.label, catData.disponibles, catData.poses, catData.planifies, false);
            const catId = Object.keys(AppState.categories).find(id => AppState.categories[id].label === catData.label);
            const cat = AppState.categories[catId];
            if (cat) {
                cat.color = catData.color;
                AppState.leaveColors[catData.label] = catData.color;
                cat.element?.querySelector(".category-color-picker")?.setAttribute("value", catData.color);
            }
        });
    }

    if (prevData?.leaveState) {
        if (prevData.categories) {
            prevData.categories.forEach(cat => { AppState.prevLeaveColors[cat.label] = cat.color; });
        }
        const januaryPrefix = `${year}-01-`;
        Object.entries(prevData.leaveState).forEach(([dateKey, state]) => {
            if (dateKey.startsWith(januaryPrefix) && !AppState.leaveState[dateKey]) {
                AppState.leaveState[dateKey] = JSON.parse(JSON.stringify(state));
                AppState.prevYearDateKeys.add(dateKey);
            }
        });
    }

    calendarManager.render(AppState.currentYear);
    updatePrevYearJanuarySummary();
}

// ===== Catégories =====

function addCategory(label = "", disponibles = 0, poses = 0, planifies = 0, first = true) {
    const id = crypto.randomUUID();
    const color = ColorUtils.generateColor();
    const category = { id, label, color, disponibles, poses, planifies, element: null };
    
    AppState.categories[id] = category;
    if (label) AppState.leaveColors[label] = color;
    
    createCategoryRow(category, first);
}

function createCategoryRow(category, first) {
    const tbody = document.querySelector(".congesSummary tbody");
    const tr = document.createElement("tr");
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

    tr.querySelector(".category-label").textContent = category.label;

    tr.querySelector(".delete-category").addEventListener("click", () => { 
        deleteCategory(category.id); 
        AppState.ui.isDirty = true; 
    });
    tr.querySelector(".edit-category").addEventListener("click", () => updateCategoryLabel(category, false));
    tr.querySelector(".category-color-picker").addEventListener("change", () => { 
        setCongeColor(category); 
        AppState.ui.isDirty = true; 
    });
    tr.querySelector(".delete-category-days").addEventListener("click", () => { 
        deleteCongeCategory(category.id, category.label); 
        AppState.ui.isDirty = true; 
    });
    tr.querySelector(`#disponibles${category.label}`).addEventListener("change", () => { 
        updateCategory(category); 
        AppState.ui.isDirty = true; 
    });

    category.element = tr;
    tbody.insertBefore(tr, tbody.children[tbody.children.length - 1]);

    if (first) updateCategoryLabel(category, true);
    if (!first) addCongesSelector(category, category.label);
    updateCategory(category);
}

function updateCategoryLabel(category, first) {
    const span = category.element.querySelector(".category-label");
    const valeurActuelle = span.innerText.trim();
    const input = document.createElement("input");
    input.type = "text";
    input.value = valeurActuelle;

    const onConfirm = (event) => {
        const newValue = convertLabel(event, category, input, valeurActuelle, span);
        if (first) addCongesSelector(category, newValue);
    };

    input.onblur = onConfirm;
    input.onkeypress = (event) => { if (event.key === "Enter") onConfirm(event); };

    span.innerHTML = "";
    span.appendChild(input);
    input.focus();
}

function convertLabel(event, category, input, valeurActuelle, span) {
    const newValue = ValidatorUtils.normalizeCategoryName(input.value);
    
    if (valeurActuelle !== newValue) {
        const validation = ValidatorUtils.validateCategoryName(newValue);
        
        if (validation !== true) {
            Toasts.addToast("error-invalid-category-name", { reason: validation });
            input.focus();
            return valeurActuelle;
        }

        if (!checkCongeValide(newValue)) {
            event.target.focus();
            return valeurActuelle;
        }

        ["disponibles", "poses", "soldeReel", "planifies", "soldePrevisionnel"].forEach(prefix => {
            const el = category.element.querySelector(`#${prefix}${category.label}`);
            if (el) el.id = `${prefix}${newValue}`;
        });
        
        span.innerText = newValue;
        category.label = newValue;
        updateCongeSelector(valeurActuelle, newValue, category);
        AppState.ui.isDirty = true;
    } else {
        span.innerText = valeurActuelle;
    }

    return newValue;
}

function checkCongeValide(newValue) {
    if (!newValue) return false;
    if (Object.values(AppState.categories).some(cat => cat.label === newValue)) {
        Toasts.addToast("warning-conge-already-exist", { label: newValue });
        return false;
    }
    return true;
}

function setCongeColor(category) {
    const th = category.element.querySelector("th");
    const conge = th.querySelector(".category-label").innerText;
    category.color = th.querySelector(".category-color-picker").value.toUpperCase();

    delete AppState.leaveColors[conge];
    AppState.leaveColors[conge] = category.color;

    document.querySelectorAll("[id^='top']").forEach(elt => {
        elt.style.backgroundColor = elt.id.includes(conge) ? category.color : "";
    });

    calendarManager.render(AppState.currentYear);
}

function addCongesSelector(category, label) {
    const el = document.createElement("div");
    el.className = "selectionConge";
    el.id = `top${label}`;
    el.textContent = label;
    el.addEventListener("click", () => toggleActiveDayOff(el, category));
    AppState.leaveColors[label] = category.color;
    document.getElementById("conges-selector").appendChild(el);
}

function updateCongeSelector(oldValue, newValue, category) {
    const el = document.getElementById(`top${oldValue}`);
    if (el) {
        el.id = `top${newValue}`;
        el.textContent = newValue;
        toggleActiveDayOff(el, category);
    }
}

function toggleActiveDayOff(elt, category) {
    const isActive = ColorUtils.rgbToHex(elt.style.backgroundColor) === category.color;
    elt.style.backgroundColor = isActive ? "" : category.color;
    AppState.ui.activeDayOff = isActive ? "" : category.label;

    document.querySelectorAll("[id^='top']").forEach(el => {
        if (el !== elt) el.style.backgroundColor = "";
    });
}

function deleteCategory(id) {
    const category = AppState.categories[id];
    if (!category) return;

    deleteCongeCategory(id, category.label);
    document.getElementById(`top${category.label}`)?.remove();
    category.element.remove();
    delete AppState.categories[id];
    delete AppState.leaveColors[category.label];

    updateTotals();
}

function deleteCongeCategory(categoryId, categoryLabel) {
    const category = AppState.categories[categoryId];
    if (!category) return;

    Object.keys(AppState.leaveState).forEach(dateKey => {
        const state = AppState.leaveState[dateKey];
        ["full", "am", "pm"].forEach(slot => {
            if (state[slot]?.type === categoryLabel) delete state[slot];
        });
        if (!state.full && !state.am && !state.pm) delete AppState.leaveState[dateKey];
    });

    calendarManager.render(AppState.currentYear);
    updateSummaryFromCalendar();
    Toasts.addToast("delete");
}

// ===== Résumé des congés =====

function updateCategory(category) {
    const el = category.element;
    category.disponibles = parseInt(el.querySelector(`#disponibles${category.label}`).value, 10);

    const soldeReel = category.disponibles - category.poses;
    const soldePrev = soldeReel - category.planifies;

    el.querySelector(`#poses${category.label}`).textContent = category.poses;
    el.querySelector(`#soldeReel${category.label}`).textContent = soldeReel;
    el.querySelector(`#planifies${category.label}`).textContent = category.planifies;
    el.querySelector(`#soldePrevisionnel${category.label}`).textContent = soldePrev;

    updateTotals();
}

function updateTotals() {
    const totals = AppState.getTotals();
    
    document.getElementById("disponiblesSum").textContent = totals.disponibles;
    document.getElementById("posesSum").textContent = totals.poses;
    document.getElementById("planifiesSum").textContent = totals.planifies;
    document.getElementById("soldeReelSum").textContent = totals.disponibles - totals.poses;
    document.getElementById("soldePrevisionnelSum").textContent = totals.disponibles - totals.poses - totals.planifies;
}

function updateSummaryFromCalendar() {
    LeaveUtils.updateCategoryCounts(AppState.leaveState, AppState.categories);
    
    Object.values(AppState.categories).forEach(cat => {
        if (!cat.element) return;
        cat.poses = Math.round(cat.poses * 10) / 10;
        cat.planifies = Math.round(cat.planifies * 10) / 10;
        const soldeReel = cat.disponibles - cat.poses;
        cat.element.querySelector(`#poses${cat.label}`).textContent = cat.poses;
        cat.element.querySelector(`#soldeReel${cat.label}`).textContent = soldeReel;
        cat.element.querySelector(`#planifies${cat.label}`).textContent = cat.planifies;
        cat.element.querySelector(`#soldePrevisionnel${cat.label}`).textContent = soldeReel - cat.planifies;
    });

    updateTotals();
    updatePrevYearJanuarySummary();
}

function updatePrevYearJanuarySummary() {
    const section = document.getElementById("prev-year-january-section");
    if (!section) return;

    if (AppState.prevYearDateKeys.size === 0) {
        section.style.display = "none";
        return;
    }

    const counts = {};
    const accumulate = (leave, amount) => {
        if (!leave) return;
        if (!counts[leave.type]) {
            counts[leave.type] = { color: AppState.prevLeaveColors[leave.type] || "#ccc", poses: 0, planifies: 0 };
        }
        if (leave.posed) counts[leave.type].poses += amount;
        else counts[leave.type].planifies += amount;
    };

    AppState.prevYearDateKeys.forEach(dateKey => {
        const state = AppState.leaveState[dateKey];
        if (!state) return;
        if (state.full) {
            accumulate(state.full, 1);
        } else {
            accumulate(state.am, 0.5);
            accumulate(state.pm, 0.5);
        }
    });

    Object.values(counts).forEach(c => {
        c.poses = Math.round(c.poses * 10) / 10;
        c.planifies = Math.round(c.planifies * 10) / 10;
    });

    document.getElementById("prev-jan-year-label").textContent = AppState.currentYear;
    document.getElementById("prev-jan-quota-year-label").textContent = AppState.currentYear - 1;

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

// ===== Initialisation =====

function initHandlers() {
    document.querySelector(".save").addEventListener("click", saveYear);
    document.querySelector(".delete").addEventListener("click", deleteYear);
    document.querySelector(".help").addEventListener("click", Modal.showHelpModal);

    document.querySelector(".plus").addEventListener("click", () => changeYear(AppState.currentYear + 1));
    document.querySelector(".minus").addEventListener("click", () => changeYear(AppState.currentYear - 1));

    document.getElementById("school-holiday").addEventListener("click", SchoolHolidays.toggleSchoolHolidays);
    document.getElementById("zone-select").addEventListener("change", SchoolHolidays.updateVacances);

    document.getElementById("half-day").addEventListener("click", (e) => { AppState.ui.isHalfDayActive = e.target.checked; });
    document.getElementById("leave").addEventListener("click", (e) => { AppState.ui.isLeaveActive = e.target.checked; });

    document.querySelector(".add-category").addEventListener("click", () => { addCategory(); AppState.ui.isDirty = true; });

    document.querySelector("#customConfirm .md-not-save").addEventListener("click", () => {
        document.getElementById("customConfirm").style.display = "none";
        if (AppState.ui.pendingYear !== null) {
            const y = AppState.ui.pendingYear;
            AppState.ui.pendingYear = null;
            applyYearChange(y);
        }
    });

    document.querySelector("#customConfirm .md-cancel").addEventListener("click", () => {
        document.getElementById("customConfirm").style.display = "none";
        document.getElementById("year").value = AppState.currentYear;
        AppState.ui.pendingYear = null;
    });

    document.querySelector("#customConfirm .md-save").addEventListener("click", () => {
        document.getElementById("customConfirm").style.display = "none";
        if (AppState.ui.pendingYear !== null) {
            const y = AppState.ui.pendingYear;
            AppState.ui.pendingYear = null;
            if (saveYear()) applyYearChange(y);
            else document.getElementById("year").value = AppState.currentYear;
        }
    });

    document.querySelector("#deleteConfirm .md-confirm").addEventListener("click", () => confirmDelete(true));
    document.querySelector("#deleteConfirm .md-cancel").addEventListener("click", () => confirmDelete(false));

    document.querySelector("#helpModal .md-cancel").addEventListener("click", Modal.showHelpModal);

    document.addEventListener("keypress", (e) => { if (AppState.ui.isHelpModalOpen && e.key === "Escape") Modal.showHelpModal(); });

    document.addEventListener("mouseup", () => { AppState.ui.isDrawing = false; });

    document.querySelector(".export").addEventListener("click", exportPDF);

    document.addEventListener("keydown", (event) => {
        const modifier = event.ctrlKey || event.metaKey;
        
        if (modifier && event.key.toLowerCase() === "d") {
            event.preventDefault();
            AppState.ui.isHalfDayActive = !AppState.ui.isHalfDayActive;
            document.getElementById("half-day").checked = AppState.ui.isHalfDayActive;
        }

        if (modifier && event.key.toLowerCase() === "p") {
            event.preventDefault();
            AppState.ui.isLeaveActive = !AppState.ui.isLeaveActive;
            document.getElementById("leave").checked = AppState.ui.isLeaveActive;
        }
    });
}

function init() {
    // AppState.init();
    calendarManager = new CalendarManager("#calendar");

    const yearInput = document.getElementById("year");
    yearInput.value = AppState.currentYear;
    yearInput.dataset.oldValue = AppState.currentYear;

    yearInput.addEventListener("change", (e) => changeYear(e.target.value));

    loadYearData(AppState.currentYear);
    calendarManager.render(AppState.currentYear);

    initHandlers();
}

init();

async function exportPDF() {
    const spinner = document.getElementById("spinner");
    const button = document.querySelector(".export");

    try {
        spinner.classList.remove("hidden");
        button.disabled = true;

        const element = document.getElementById("calendar");

        const canvas = await html2canvas(element, {
            scale: window.devicePixelRatio * 2,
            useCORS: true,
            backgroundColor: "#c9c9c9"
        });

        const { jsPDF } = window.jspdf;

        const imgData = canvas.toDataURL("image/jpeg");
        const pdf = new jsPDF("l", "mm", "a4");

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const margin = 10;
        const usableWidth = pageWidth - margin * 2;
        const usableHeight = pageHeight - margin * 2;

        const ratio = canvas.width / canvas.height;

        let renderWidth = usableWidth;
        let renderHeight = renderWidth / ratio;

        if (renderHeight > usableHeight) {
            renderHeight = usableHeight;
            renderWidth = renderHeight * ratio;
        }

        const x = (pageWidth - renderWidth) / 2;

        pdf.setFillColor(201, 201, 201);
        pdf.rect(0, 0, pageWidth, pageHeight, "F");

        pdf.addImage(imgData, "JPEG", x, 10, renderWidth, renderHeight);

        pdf.save("export.pdf");

        Toasts.addToast("success-export-PDF");

    } catch (e) {
        console.log(e);
        Toasts.addToast("error-export-PDF");
    } finally {
        spinner.classList.add("hidden");
        button.disabled = false;
    }
}
