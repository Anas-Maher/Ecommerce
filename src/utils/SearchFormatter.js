/**
 *
 * @param {string} name
 * @returns {string}
 */
function Format(name) {
    return name
        .replaceAll(/[^a-zA-Z0-9]/g, "")
        .split("")
        .sort((a, b) => a.localeCompare(b))
        .join("");
}

export default Format;
