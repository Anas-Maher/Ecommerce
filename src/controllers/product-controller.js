import category_model from "../db/models/category-model.js";
import products_model from "../db/models/product-model.js";
import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import { folder_name } from "../utils/Envs.js";
import NextError from "../utils/NextError.js";
import Format from "../utils/SearchFormatter.js";
import cloud from "../utils/cloud.js";
import crypto from "crypto";
export const add_product = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const {
        name,
        description,
        available_items,
        price,
        discount,
        category,
        subcategory,
        brand,
    } = req.body;
    if (Object.keys(req?.files).length === 0) {
        return CallNext("images are required");
    }
    const unique_name = crypto.randomBytes(16).toString("hex");
    const images = [];
    for (const file of req?.files?.view) {
        const { secure_url, public_id } = await cloud.uploader.upload(
            file?.path,
            { folder: `${folder_name}/products/${unique_name}` }
        );
        images.push({ secure_url, public_id });
    }
    const { secure_url, public_id } = await cloud.uploader.upload(
        req?.files?.source[0]?.path,
        {
            folder: `${folder_name}/products/${unique_name}`,
        }
    );
    const product = await products_model.create({
        "cloud-folder": unique_name,
        creator: req?.user?._id,
        "default-image": {
            secure_url: secure_url,
            public_id: public_id,
        },
        images,
        "available-items": available_items,
        "discount-percentage": discount,
        brand,
        category,
        price,
        subcategory,
        name: name,
        slug: Format(name),
        description,
    });
    return res.status(201).json({ done: true, payload: product });
});

export const delete_product = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { id } = req.params;
    const product = await products_model.findById(id);
    if (!product) {
        return CallNext("product not found", 400);
    }
    if (req.user._id.toString() !== product.creator.toString()) {
        return CallNext("you are not authorized", 403);
    }
    // const ids = product.images.map(({public_id}) => public_id)
    // ids.push(product["default-image"].public_id)
    // await cloud.api.delete_resources(ids)
    await cloud.api.delete_folder(
        `${folder_name}/products/${product["cloud-folder"]}`
    );
    await product.deleteOne();
    return res.status(201).json({ done: true, payload: "deleted!" });
});

export const all_products = AsyncErrorHandler(async (_req, res, _next) => {
    const product = await products_model.find();
    return res.json({ done: true, payload: product });
});
export const search_products = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    let { fields, sort } = req.query;
    const product = await products_model
        .find({})
        ?.custom_select(fields)
        ?.sort(sort);
    return res.json({ done: true, payload: product });
});

export const single_product = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { id } = req.params;
    const product = await products_model.findById(id);
    if (!product) {
        return CallNext('product not found ' , 404)
    }
    return res.json({ done: true, payload: product });
});

export const category_product = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { id } = req.params;
    const category = await category_model.findByIdAndDelete(id);
    if (!category) {
        return CallNext("category not found", 404);
    }
    const product = await products_model.findOne({ category: id });
    return res.json({ done: true, payload: product });
});
