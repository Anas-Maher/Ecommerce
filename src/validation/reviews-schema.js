import joi from "joi";
import IsValidObjectId from "../utils/Is_valid_object_Id.js";
export const add_review_schema = {
    body: joi
        .object({
            content: joi.string().required(),
            title: joi.string().required(),
            product_id: joi.string().custom(IsValidObjectId).required(),
            rating: joi.number().min(1).max(5).required(),
        })
        .required(),
};
export const delete_review_schema = {
    params: joi
        .object({
            review_id: joi.string().custom(IsValidObjectId).required(),
        })
        .required(),
};
export const update_review_schema = {
    body: joi
        .object({
            content: joi.string(),
            title: joi.string(),
            rating: joi.number().min(1).max(5),
        })
        .required(),
    params: joi
        .object({
            review_id: joi.string().custom(IsValidObjectId).required(),
        })
        .required(),
};
