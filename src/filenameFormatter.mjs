const replacements = [
    ["ä", "ae"],
    ["ö", "oe"],
    ["ü", "ue"],
    ["ß", "ss"],
    ["Ä", "Ae"],
    ["Ö", "Oe"],
    ["Ü", "Ue"],
]

function makeFilenameStr(str) {
    let res = str;
    for (const repl of replacements) {
        res = res.replace(repl[0], repl[1]);
    }
    res = res.normalize("NFKD").replace(/[\u0300-\u036F]/g, "");
    res = res.replace(/[^A-Za-z0-9]/g, "");
    return res;
}

export function filenameFormat(player, format) {
    return format.replace(/\{([0-9]+)(:[a-zA-Z0-9:]+)?\}/g, (substr, column, arg) => {
        const colNum = parseInt(column);
        if (!isFinite(colNum)) {
            return substr;
        }
        if (player.length <= colNum) {
            return "";
        }
        const colNorm = makeFilenameStr(player[colNum]);
        if (!arg || arg.length == 0) {
            return colNorm
        }
        if (arg == ":lower") {
            return colNorm.toLowerCase();
        }
        if (arg == ":upper") {
            return colNorm.toUpperCase();
        }
        if (arg.startsWith(":pad:")) {
            const colParse = parseFloat(player[colNum]);
            const padParse = parseInt(arg.substring(5));
            if (isFinite(colParse) && isFinite(padParse)) {
                return colParse.toString(10).padStart(padParse, "0");
            }
        }
    });
}