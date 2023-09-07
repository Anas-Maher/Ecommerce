import users_model from "../db/models/users-models.js";
import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import crypto from "crypto";
import SendMail from "../utils/SendMail.js";
import NextError from "../utils/NextError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Expiration_Time, jwt_signature, rounds } from "../utils/Envs.js";
import token_model from "../db/models/token-model.js";
import {
    Generate_Html,
    confirm_email_template,
} from "../utils/HtmlTemplates.js";
import cart_model from "../db/models/cart-model.js";
export const signup = AsyncErrorHandler(
    /**/ async (req, res, next) => {
        const { CallNext } = NextError(next);
        const {
            "user-name": user_name,
            password,
            email,
            gender,
            phone,
            role,
        } = req.body;
        const is_user = await users_model.findOne({ email });
        if (is_user) {
            /**
             * @type {import("./types/index.js").Json_Response}
             */
            const res1 = { error: "user already exists", done: true };
            return res.json(res1);
        }
        const code = crypto.randomBytes(16).toString("hex");
        const user = await users_model.create({
            "user-name": user_name,
            password,
            email,
            gender,
            "activation-code": code,
            phone,
            role: role || "buyer",
        });
        // await cart_model.create({user : user._id , products : {"product-id" : }})
        const html = confirm_email_template(
            `${req.protocol}://${req.headers.host}/users/confirm-email/${code}`
        );
        const sent = await SendMail({
            html,
            to: user.email,
        });
        if (sent) {
            /**
             * @type {import("./types/index.js").Json_Response}
             */
            const res2 = { done: true, payload: "check your inbox" };
            return res.status(201).json(res2);
        }
        await users_model.findByIdAndDelete(user._id);
        /**
         * @type {import("./types/index.js").Json_Response}
         */
        const res3 = { done: false, error: "register again" };
        return CallNext(res3, 500);
    }
);
export const confirm_email = AsyncErrorHandler(async (req, res, next) => {
    const { token } = req.params;
    const { CallNext } = NextError(next);
    const user = await users_model.findOneAndUpdate(
        { "activation-code": token },
        { $set: { "is-confirmed": true }, $unset: { "activation-code": 1 } }
    );
    if (!user) {
        // todo redirect to frontend
        return CallNext("User not found please try to register", 404);
    }
    await cart_model.create({ user: user._id });
    /**
     * @type {import("./types/index.js").Json_Response}
     */
    const res1 = { done: true, payload: "Great! Now  login" };
    return res.json(res1);
});
export const login = AsyncErrorHandler(async (req, res, next) => {
    const { email: _email, password } = req.body;
    const { CallNext } = NextError(next);
    const user = await users_model.findOne({ email: _email });
    if (!user) return CallNext("please register now", 404);
    const valid_password = bcrypt.compareSync(password, user.password);
    if (!valid_password)
        return CallNext(
            "Please Check Email And Password or reset password",
            400
        );
    const token = jwt.sign({ email: _email }, jwt_signature, {
        expiresIn: Expiration_Time,
    });
    const agent = req.headers?.agent;
    await token_model.create({ agent, token, user: user._id });
    await user.updateOne({ $set: { status: "online" } }, { new: true });
    const res1 = { payload: token, done: true };
    return res.json(res1);
});
export const forget_password = AsyncErrorHandler(async (req, res, next) => {
    const { email } = req.body;
    const { CallNext } = NextError(next);
    const user = await users_model.findOne({ email });
    if (!user || !user["is-confirmed"]) {
        return CallNext("please activate your account or register again", 404);
    }
    const code = `${Math.trunc(Math.random() * 10 ** 8)}`;
    await user.updateOne({ $set: { "forget-code": code } }, { new: true });
    const url = `https://`;
    const html = Generate_Html({
        url,
        msg: `Confirmation Code is ${code}`,
    });
    // Todo redirect to frontend
    const sent = await SendMail({
        subject: "Reset Password",
        to: user.email,
        html,
    });
    if (!sent) {
        return CallNext("sorry try again", 500);
    }
    /**
     * @type {import("./types/index.js").Json_Response}
     */
    const res1 = { done: true, payload: "check tour inbox" };
    return res.json(res1);
});
export const reset_password = AsyncErrorHandler(async (req, res, next) => {
    const { email, password, code } = req.body;
    const { CallNext } = NextError(next);
    const is_user = await users_model.findOne({ email, "forget-code": code });
    if (!is_user || !is_user["is-confirmed"]) {
        return CallNext("invalid code", 401);
    }
    const user = await users_model.findOneAndUpdate(
        { email },
        { $unset: { "forget-code": 1 } },
        { new: true }
    );
    const tokens = await token_model.find({ user: user._id });
    tokens.forEach((token) => token.updateOne({ $set: { "is-valid": false } }));
    await is_user.updateOne({
        $set: { password: bcrypt.hashSync(password, rounds) },
    });
    const res1 = { done: true, payload: "try to login again" };
    return res.json(res1);
});
