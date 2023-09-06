import Joi from "joi";
const phone_regex = /^01[0125][0-9]{8}$/;
export const signup_schema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        "user-name": Joi.string().required(),
        password: Joi.string().required(),
        "confirm-password": Joi.string().valid(Joi.ref("password")).required(),
        gender: Joi.valid("male").valid("female").required(),
        phone: Joi.string().regex(phone_regex),
        role: Joi.string().regex(/seller|buyer/),
    }).required(),
};
export const confirm_email_schema = {
    params: Joi.object({
        code: Joi.string().required(),
    }).required(),
};
export const login_schema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }).required(),
};
export const forget_password_schema = {
    body: Joi.object({
        email: Joi.string().email().required(),
    }).required(),
};
export const reset_password_schema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        "confirm-password": Joi.string().valid(Joi.ref("password")).required(),
        code: Joi.string().min(6).max(10).required(),
    }).required(),
};
