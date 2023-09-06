import category_model from "../db/models/category-model.js";
import subcategory_model from "../db/models/subcategory-model.js";
import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import { folder_name } from "../utils/Envs.js";
import NextError from "../utils/NextError.js";
import Format from "../utils/SearchFormatter.js";
import cloud from "../utils/cloud.js";

export const create_subcategory = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { name, category_id } = req.body;
    const category = await category_model.findById(category_id);
    if (!req.file) {
        return CallNext("image not found", 400);
    }
    if (!category) {
        return CallNext("category not found", 400);
    }
    const { secure_url, public_id } = await cloud.uploader.upload(
        req?.file?.path,
        {
            folder: `${folder_name}/subcategory`,
        }
    );
    const subcategory = await subcategory_model.create({
        "display-name": name,
        "search-name": Format(name),
        "parent-category": category_id,
        image: {
            "secure-url": secure_url,
            "public-id": public_id,
        },
        creator: req?.user?._id,
    });
    return res.status(201).json({ done: true, payload: subcategory });
});
export const update_subcategory = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { id } = req.params;
    const { name, category_id } = req.body;
    const category = await category_model.findById(category_id);
    const subcategory = await subcategory_model.findById(id);
    if (!category) {
        return CallNext("category not found", 404);
    }
    if (!subcategory) {
        return CallNext("subcategory not found", 404);
    }
    if (req.file) {
        const { secure_url, public_id } = await cloud.uploader.upload(
            req?.file?.path,
            {
                public_id: subcategory.image["public-id"],
            }
        );
        await subcategory.updateOne(
            {
                $set: {
                    image: {
                        "secure-url": secure_url,
                        "public-id": public_id,
                    },
                },
            },
            { new: true }
        );
    }
    const _name = name || subcategory["display-name"];
    await subcategory.updateOne(
        {
            $set: {
                "display-name": _name,
                "search-name": Format(_name),
            },
        },
        { new: true }
    );
    return res.status(201).json({ done: true, payload: subcategory });
});

export const delete_subcategory = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { id } = req.params;
    const subcategory = await subcategory_model.findById(id);
    if (!subcategory) return CallNext("subcategory not found", 404);
    await cloud.uploader.destroy(subcategory.image["public-id"]);
    await subcategory.deleteOne();
    return res.json({ done: true, payload: "deleted successfully" });
});

export const all_subcategories = AsyncErrorHandler(async (_req, res, _next) => {
    const all = await subcategory_model.find().populate([
        {
            path: "parent-category",
            populate: [{ path: "creator" }],
        },
        {
            path: "creator",
        },
    ]);
    return res.json({ done: true, payload: all });
});
