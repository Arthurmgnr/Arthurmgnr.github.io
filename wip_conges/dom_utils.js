
const DomUtils = {

    get(value) {
        const first = value.substring(0, 1);
        const val = value.substring(1);
        if (first.startsWith("#")) {
            return document.getElementById(val);
        } else if (first.startsWith(".")) {
            return document.getElementsByClassName(val);
        }
    },
};