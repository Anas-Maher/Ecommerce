import Joi from "joi";
import IsValidObjectId from "../utils/Is_valid_object_Id.js";

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
