import { Schema, Types, model } from "mongoose";
export const products_schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true },
        description: { type: String, required: true, lowercase: true },
        images: [
            {
                secure_url: { type: String, required: true },
                public_id: { type: String, required: true },
            },
        ],
        "default-image": {
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
        "available-items": { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 1 },
        "cloud-folder": { type: String, unique: true },
        "sold-items": { type: Number, default: 0 },
        "discount-percentage": {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
            required: true,
        },
        creator: {
            type: Types.ObjectId,
            ref: "user",
            required: true,
        },
        category: {
            type: Types.ObjectId,
            ref: "category",
            required: true,
        },
        subcategory: {
            type: Types.ObjectId,
            ref: "subcategory",
            required: true,
        },
        brand: {
            type: Types.ObjectId,
            ref: "brand",
            required: true,
        },
    },
    {
        timestamps: true,
        strictQuery: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
products_schema.virtual("final_price").get(function () {
    const d = Number(this["discount-percentage"]) || 0;
    const p = Number(this["price"]) || 1;
    return (p - (p - d) / 100).toFixed(2);
});
/**
 *
 * @param {number | undefined | string} page
 * @param {number | undefined | string} limit
 */
products_schema.query.paginate = function (page, limit = 2) {
    page = !page || isNaN(page) || page < 1 ? 1 : Math.trunc(page);
    limit = !limit || isNaN(limit) || limit < 1 ? 2 : Math.trunc(limit);
    const skip = (page - 1) * limit;
    return this?.skip(skip)?.limit(limit);
};
/**
 *
 * @param {number} stock
 * @returns
 */
products_schema.methods.enough_stock = function (stock) {
    return this?.["available-items"] >= stock;
};
/**
 *
 * @param {string[]} fields
 */
products_schema.query.custom_select = function (fields) {
    if (!fields) return this;
    const model_keys = Object.keys(products_model.schema.paths);
    const query_keys = fields?.split(" ")?.map((v) => v?.trim());
    const matched_keys = query_keys?.filter((v) => model_keys.includes(v));
    return this?.select(matched_keys);
};
const products_model = model("product", products_schema);
export default products_model;
