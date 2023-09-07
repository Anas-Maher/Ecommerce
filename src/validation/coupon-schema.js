import Joi from "joi";
import { Types } from "mongoose";

export const create_coupon_schema = {
    body: Joi.object({
        discount: Joi.number().min(1).max(100).required(),
        expires_at: Joi.date().greater(Date.now()).required(),
    }).required(),
};
export const update_coupon_schema = {
    params: Joi.object({
        code: Joi.string().required(),
    }).required(),
    body: Joi.object({
        expires_at: Joi.date().greater(Date.now()),
        discount: Joi.number().min(1).max(100),
    }).required(),
};
export const delete_coupon_schema = {
    params: Joi.object({
        code: Joi.string().required(),
    }).required(),
};
