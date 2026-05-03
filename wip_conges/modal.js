
const Modal = {

    showHelpModal() {
        AppState.ui.isHelpModalOpen = !AppState.ui.isHelpModalOpen;
        document.getElementById("helpModal").style.display = AppState.ui.isHelpModalOpen ? "flex" : "none";
    },
};
