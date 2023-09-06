import Joi from "joi";
import { Types } from "mongoose";
const IsValidObjectId = (v, h) => {
    return !Types.ObjectId.isValid(v)
        ? h.message("param must be of type Object Id")
        : true;
};

export const create_brand_schema = {
    body: Joi.object({
        name: Joi.string().required(),
        subcategory_id: Joi.string().custom(IsValidObjectId).required(),
    }),
};
export const update_brand_schema = {
    body: Joi.object({
        name: Joi.string(),
    }),
    params: Joi.object({
        id: Joi.string().custom(IsValidObjectId).required(),
    }),
};
export const delete_brand_schema = {
    params: Joi.object({
        id: Joi.string().custom(IsValidObjectId).required(),
    }),
};
