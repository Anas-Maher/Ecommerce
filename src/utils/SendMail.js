import mailer from "nodemailer";
import "dotenv/config";
import { email, password } from "./Envs.js";
/**
 * Mail with headers or attachments
 */
/**
 *
 * @param {import("../types").Mail_Things.Mail} param0
 * @returns {Promise<boolean>}
 */
const SendMail = async ({ to, html, subject } = {}) => {
    const from = `Ecommerce <ecommerce-app@gmail.com>`;
    subject ||= "Confirm Email";
    const Service = mailer.createTransport({
        service: "gmail",
        auth: {
            user: `${email}`,
            pass: `${password}`,
        },
    });
    const mail = await Service.sendMail({
        from,
        to,
        subject,
        html,
    });
    Service.close();
    return mail.accepted.length < 1 ? false : true;
};

export default SendMail;
