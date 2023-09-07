import Joi from "joi";
import IsValidObjectId from "../utils/Is_valid_object_Id.js";
const phone_regex = /^01[0125][0-9]{8}$/;
export const create_order_schema = {
    body: Joi.object({
        address: Joi.string().required(),
        coupon: Joi.string(),
        phone: Joi.string().regex(phone_regex).required(),
        payment: Joi.string().valid("card", "cash").required(),
    }),
};
export const cancel_order_schema = {
    params: Joi.object({
        id: Joi.string().custom(IsValidObjectId).required(),
    }),
};
