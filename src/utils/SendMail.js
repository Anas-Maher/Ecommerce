import mailer from "nodemailer";
import "dotenv/config";
import { email, password } from "./Envs.js";
/**
 * Mail with headers or attachments
 */
/**
 *
 * @param {import("../types").Mail} param0
 * @returns {Promise<boolean>}
 */
const SendMail = async ({ to, html, subject, text, attachments } = {}) => {
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
        text,
        attachments 
    });
    Service.close();
    return mail.accepted.length < 1 ? false : true;
};

export default SendMail;
