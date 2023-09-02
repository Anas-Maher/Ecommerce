/**
 *
 * @param {string[]} urls
 * @returns {string} template
 */
const Generate_Html = (...urls) => {
    return urls.map(
        (url, i) =>
            `
        <a style="text-decoration:none;font-size:1.3rem;margin:1rem auto;" href="${url}">${
                !i ? "Confirm Email" : "Reconfirm Email"
            }</a>
        `
    );
};

export default Generate_Html;
