
import { createFilterGroupElement, createFilterSelectionItem} from "/site/components/filter.js";

export function createFilterPrix(categorie, titleElement, titleItem, prixMin, prixMax, onChange) {
    // Constantes
    let minValue = prixMin;
    let maxValue = prixMax;

    let minStore = minValue;
    let maxStore = maxValue;

    // -------------------------

    // FilterGroupElement
    const values = createFilterGroupElement(categorie, titleElement);
    const filterGroupElement = values[0];
    const filterGroupBlock = values[1];
    const filterGroup = values[2];
    
    const inputContainer = document.createElement("div");
    inputContainer.classList = "input-container";

    const inputContainerSideMin = document.createElement("div");
    inputContainerSideMin.classList = "input-container-left text-center";
    const inputTitleMin = document.createElement("div");
    inputTitleMin.classList = "input-title mb-2";
    inputTitleMin.innerText = "Mini (€)";
    const inputMin = document.createElement("input");
    inputMin.type = "number";
    inputMin.id = "minInput";
    inputMin.onkeydown = function(event) { controlKeyPress(true, event); }
    inputMin.onblur = function(event) { validateInput(true)(event); }
    inputMin.onchange = function(event) { validateInput(true)(event); }
    inputContainerSideMin.append(inputTitleMin, inputMin);

    const inputContainerSideMax = document.createElement("div");
    inputContainerSideMax.classList = "input-container-right text-center";
    const inputTitleMax = document.createElement("div");
    inputTitleMax.classList = "input-title mb-2";
    inputTitleMax.innerText = "Mini (€)";
    const inputMax = document.createElement("input");
    inputMax.type = "number";
    inputMax.id = "maxInput";
    inputMax.onkeydown = function(event) { controlKeyPress(true, event); }
    inputMax.onblur = function(event) { validateInput(true)(event); }
    inputMax.onchange = function(event) { validateInput(true)(event); }
    inputContainerSideMax.append(inputTitleMax, inputMax);

    inputContainer.append(inputContainerSideMin, inputContainerSideMax);

    const sliderContainerContainer = document.createElement("div");
    sliderContainerContainer.classList = "slider-container-container";
    const sliderContainer = document.createElement("div");
    sliderContainer.classList = "slider-container";
    sliderContainer.setAttribute("data-min", prixMin);
    sliderContainer.setAttribute("data-max", prixMax);
    sliderContainer.onclick = function(event) { onSliderClick(event); }
    const sliderFill = document.createElement("div");
    sliderFill.classList = "slider-fill";
    const sliderHandleMin = document.createElement("div");
    sliderHandleMin.classList = "slider-handle min";
    sliderHandleMin.onmousedown = function() { onDrag(true); }
    const sliderHandleMax = document.createElement("div");
    sliderHandleMax.classList = "slider-handle max";
    sliderHandleMax.onmousedown = function() { onDrag(false); }
    sliderContainer.append(sliderFill, sliderHandleMin, sliderHandleMax);
    sliderContainerContainer.append(sliderContainer);

    const filterPrixApply = document.createElement("div");
    filterPrixApply.classList = "filter-prix-apply disabled";
    filterPrixApply.onclick = function() {
        spanMinPriceValue.innerText = minValue;
        spanMaxPriceValue.innerText = maxValue;
        filterSelectedItem.classList.remove("disabled");
        filterPrixApply.classList.add("disabled");
        onChange();
    }
    filterPrixApply.innerText = "Appliquer";

    filterGroupBlock.append(inputContainer, sliderContainerContainer, filterPrixApply);
    filterGroupElement.append(filterGroupBlock);

    // -------------------------

    // FilterSelectedItem
    const filterSelectedItem = createFilterSelectionItem(categorie, titleItem);

    const filterSelectedItemContent = document.createElement("div");
    filterSelectedItemContent.classList = "filter-selected-item-content";
    const spanTexte = document.createElement("span");
    spanTexte.classList = "filter-selected-item-content-text";
    spanTexte.onclick = function() { filterGroupElement.resetAll(true); };

    const spanMinPriceValue = document.createElement("span");
    spanMinPriceValue.id = "minPriceValue";
    const spanMaxPriceValue = document.createElement("span");
    spanMaxPriceValue.id = "maxPriceValue";
    const spanSpanIcone = document.createElement("span");
    spanSpanIcone.classList = "material-symbols-outlined filter-selected-item-content-icon";
    spanSpanIcone.innerText = "close";
    spanTexte.append("Entre ", spanMinPriceValue, "€ et ", spanMaxPriceValue, "€ ", spanSpanIcone);
    filterSelectedItemContent.append(spanTexte);

    filterSelectedItem.append(filterSelectedItemContent);

    // -------------------------

    function updateSlider() {
        const minPercent = ((minValue - prixMin) / (prixMax - prixMin)) * 100;
        const maxPercent = ((maxValue - prixMin) / (prixMax - prixMin)) * 100;
    
        sliderHandleMin.style.left = `calc(${minPercent}%)`;
        sliderHandleMax.style.left = `calc(${maxPercent}% - 20px)`;
    
        sliderFill.style.left = minPercent + "%";
        sliderFill.style.width = (maxPercent - minPercent) + "%";
    
        inputMin.value = minValue;
        inputMax.value = maxValue;
    }
    
    filterGroupElement.updateSlider = updateSlider;

    function moveHandleTo(isMin, newValue) {
        if (isMin ? (minStore != newValue) : (maxStore != newValue)) filterPrixApply.classList.remove("disabled");
    
        if (isMin) {
            minValue = Math.max(prixMin, Math.min(newValue, maxValue - 1));
            minStore = minValue;
        }
        else {
            maxValue = Math.min(prixMax, Math.max(newValue, minValue + 1));
            maxStore = maxValue;
        }
        updateSlider();
    }
    
    function onDrag(isMin) {
        function moveHandler(e) {
            const rect = sliderContainer.getBoundingClientRect();
            let percent = ((e.clientX - rect.left) / rect.width) * 100;
            percent = Math.max(0, Math.min(100, percent));
    
            const value = Math.round(prixMin + (percent / 100) * (prixMax - prixMin));
            moveHandleTo(isMin, value);
        }
    
        function stopHandler() {
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", stopHandler);
        }
    
        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", stopHandler);
    }
    
    function onSliderClick(e) {
        const rect = sliderContainer.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        const clickedValue = Math.round(prixMin + (percent / 100) * (prixMax - prixMin));
    
        const minDiff = Math.abs(clickedValue - minValue);
        const maxDiff = Math.abs(clickedValue - maxValue);
    
        if (minDiff < maxDiff) moveHandleTo(true, clickedValue);
        else moveHandleTo(false, clickedValue);
    }
    
    function validateInput(isMin) {
        return function (event) {
            const value = parseInt(event.target.value);
            if (isNaN(value)) {
                if (isMin) event.target.value = minStore;
                else event.target.value = maxStore;
                return;
            }
    
            moveHandleTo(isMin, value);
        };
    }
    
    function controlKeyPress(isMin, event) {
        if (event.key === "Enter") {
            if (isMin) validateInput(true)(event);
            else validateInput(false)(event);
        }
    }

    // -------------------------

    filterGroupElement.resetAll = function(bool) {
        moveHandleTo(true, prixMin);
        moveHandleTo(false, prixMax);

        filterSelectedItem.classList.add("disabled");
        filterPrixApply.classList.add("disabled");

        if (filterGroup.getAttribute("aria-expanded") === "true") filterGroup.click();

        if (bool) onChange();
    };

    filterGroupElement.getSelected = function(value) {
        // return minValue <= value && value <= maxValue;
        if (value > maxValue || value < minValue) return true;
        else return false;
    };

    return [filterGroupElement, filterSelectedItem];
}
