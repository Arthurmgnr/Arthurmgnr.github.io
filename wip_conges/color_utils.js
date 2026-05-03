
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
