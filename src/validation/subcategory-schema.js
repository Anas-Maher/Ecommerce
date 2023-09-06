import Joi from "joi";
import { Types } from "mongoose";
const IsValidObjectId = (v, h) => {
    return !Types.ObjectId.isValid(v)
        ? h.message("param must be of type Object Id")
        : true;
};
export const create_subcategory_schema = {
    body: Joi.object({
        name: Joi.string().required(),
        category_id: Joi.string().custom(IsValidObjectId).required(),
    }),
};
export const update_subcategory_schema = {
    body: Joi.object({
        name: Joi.string(),
        category_id: Joi.string().custom(IsValidObjectId).required(),
    }),
    params: Joi.object({
        id: Joi.string().custom(IsValidObjectId).required(),
    }),
};
export const delete_subcategory_schema = {
    params: Joi.object({
        id: Joi.string().custom(IsValidObjectId).required(),
    }),
};
