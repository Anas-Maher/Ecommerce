import Joi from "joi";
import { Types } from "mongoose";
const IsValidObjectId = (v, h) => {
    return !Types.ObjectId.isValid(v)
        ? h.message("creator must be of type Object Id")
        : true;
};

export const create_category_schema = {
    body: Joi.object({
        name: Joi.string().required(),
        // image_url: Joi.string().required(),
    }),
};
export const update_category_schema = {
    body: Joi.object({
        name: Joi.string(),
    }),
    params: Joi.object({
        id: Joi.string().custom(IsValidObjectId).required(),
    }),
};
export const delete_category_schema = {
    params: Joi.object({
        id: Joi.string().custom(IsValidObjectId).required(),
    }),
};
