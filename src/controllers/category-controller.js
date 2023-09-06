import category_model from "../db/models/category-model.js";
import subcategory_model from "../db/models/subcategory-model.js";
import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import { folder_name } from "../utils/Envs.js";
import NextError from "../utils/NextError.js";
import Format from "../utils/SearchFormatter.js";
import cloud from "../utils/cloud.js";

export const create_category = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { name } = req.body;
    const { _id: creator } = req?.user;
    if (!req.file) return CallNext("Category Photo Is Required", 400);
    const path = req?.file?.path; //
    const { secure_url, public_id } = await cloud.uploader.upload(path, {
        folder: `${folder_name}/category`,
    });
    const category = await category_model.create({
        "display-name": name,
        "search-name": Format(name),
        creator,
        image: {
            "secure-url": secure_url,
            "public-id": public_id,
        },
    });
    /**@type {import("../types/").Json_Response} */
    const res1 = { done: true, payload: category, __: false };
    return res.status(201).json(res1);
});
export const update_category = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { id } = req.params;
    let { name } = req.body;
    const category = await category_model.findById(id);
    if (!category) {
        return CallNext("category not found", 401);
    }
    if (category._id.toString() !== req?.user?._id.toString()) {
        return CallNext("you are not authorized", 403);
    }
    name ||= category["display-name"];
    await category.updateOne({
        "display-name": name,
        "search-name": Format(name),
    });
    if (req.file) {
        await cloud.uploader.upload(req?.file?.path, {
            public_id: category.image["public-id"],
        });
    }
    /**@type {import("../types/").Json_Response} */
    const res1 = { done: true, payload: category, __: false };
    return res.status(201).json({ __: false, ...res1 });
});

export const delete_category = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { id } = req.params;
    const { uuid } = req.body;
    if (category._id.toString() !== req?.user?._id.toString()) {
        return CallNext("you are not authorized ", 403);
    }
    //Todo Delete All The category products
    const category = await category_model.findById(id);
    if (!category) return CallNext("Category Not found", 400);
    await cloud.uploader.destroy(category.image["public-id"]);
    await category_model.findByIdAndDelete(id);
    return res.json({ done: true, payload: "deleted successfully" });
});

export const all_catagories = AsyncErrorHandler(async (_req, res, _next) => {
    const all = await category_model
        .find()
        .populate([
            { path: "subs", populate: [{ path: "creator" }] },
            { path: "creator" },
        ]);
    return res.json({ done: true, payload: all });
});
