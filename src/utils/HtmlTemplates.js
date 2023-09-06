/**
 *
 * @param {Array<{url : string , msg :string}>} urls
    @returns {string}
 */
export const Generate_Html = (...urls) => {
    return urls
        .map(
            ({ url, msg }) =>
                `
        <a 
        style="text-decoration:none;font-size:1.3rem;margin:1rem auto;" href="${url}">${msg}</a>
        <br/>
        `
        )
        .join("\n");
};
/**
 *
 * @param {string} link
 * @returns {string} Html template
 */
export const confirm_email_template = (link) => `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Confirm Email</title>
    </head>
    <body>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }
            a {
                all: unset;
                text-decoration: none;
                text-transform: capitalize;
                font-size: 1.4rem;
                background-color: blue;
                color: white;
                padding: 0.5rem;
                border-radius: 1rem;
                cursor: pointer;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
            h3 {
                text-transform: capitalize;
            }
        </style>
        <a href="${link}">Confirm Email</a>
        <h3>Please Go To This url is The link above doesn't work: </h3>
        <h4>${link} </h4>
    </body>
</html>
`;
