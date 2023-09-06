import brand_model from "../db/models/brand-model.js";
import subcategory_model from "../db/models/subcategory-model.js";
import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import { folder_name } from "../utils/Envs.js";
import NextError from "../utils/NextError.js";
import Format from "../utils/SearchFormatter.js";
import cloud from "../utils/cloud.js";

export const create_brand = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { name, subcategory_id } = req.body;
    const { _id: creator } = req?.user;
    if (!req.file) return CallNext("Brand Photo Is Required", 400);
    const subcategory = await subcategory_model.findById(subcategory_id);
    if (!subcategory) {
        return CallNext("subcategory not found");
    }
    const path = req?.file?.path; //

    const { secure_url, public_id } = await cloud.uploader.upload(path, {
        folder: `${folder_name}/brand`,
    });
    const brand = await brand_model.create({
        "display-name": name,
        "search-name": Format(name),
        creator,
        image: {
            "secure-url": secure_url,
            "public-id": public_id,
        },
        "subcategory-id": subcategory_id,
    });
    /**@type {import("../types/").Json_Response} */
    const res1 = { done: true, payload: brand, __: false };
    return res.status(201).json(res1);
});
export const update_brand = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { id } = req.params;
    let { name } = req.body;
    const brand = await brand_model.findById(id);
    if (!brand) {
        return CallNext("brand not found", 401);
    }
    if (brand._id.toString() !== req?.user?._id.toString()) {
        return CallNext("you are not authorized", 403);
    }
    name ||= brand["display-name"];
    await brand.updateOne({
        "display-name": name,
        "search-name": Format(name),
    });
    if (req.file) {
        await cloud.uploader.upload(req?.file?.path, {
            public_id: brand.image["public-id"],
        });
    }
    /**@type {import("../types/").Json_Response} */
    const res1 = { done: true, payload: brand, __: false };
    return res.status(201).json({ __: false, ...res1 });
});

export const delete_brand = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { id } = req.params;
    const { uuid } = req.body;
    //Todo Delete All The brand products
    const brand = await brand_model.findById(id);
    if (!brand) return CallNext("Brand Not found", 400);
    if (brand._id.toString() !== req?.user?._id.toString()) {
        return CallNext("you are not authorized", 403);
    }
    await cloud.uploader.destroy(brand.image["public-id"]);
    await brand_model.findByIdAndDelete(id);
    return res.json({ done: true, payload: "deleted successfully" });
});

export const all_brands = AsyncErrorHandler(async (_req, res, _next) => {
    const all = await brand_model
        .find()
        .populate([
            { path: "subcategory-id", populate: [{ path: "creator" }] },
            { path: "creator" },
        ]);
    return res.json({ done: true, payload: all });
});
