import { Schema, Types, model } from "mongoose";
import products_model from "./product-model.js";
import brand_model from "./brand-model.js";

export const subcategory_schema = new Schema(
    {
        "display-name": {
            type: String,
            required: true,
        },
        "search-name": {
            type: String,
            required: true,
            lowercase: true,
        },
        image: {
            "secure-url": {
                type: String,
                required: true,
            },
            "public-id": {
                type: String,
                required: true,
            },
        },
        "parent-category": {
            type: Types.ObjectId,
            ref: "category",
            required: true,
        },
        creator: {
            type: Types.ObjectId,
            ref: "users",
            required: true,
        },
    },
    {
        timestamps: true,
        strictQuery: true,
        toJSON: { virtuals: true },
        toObject: {
            virtuals: true,
        },
    }
);
subcategory_schema.virtual("brands", {
    ref: "brand",
    localField: "_id",
    foreignField: "subcategory-id",
});
subcategory_schema.post(
    "deleteOne",
    { document: true, query: false },
    async function () {
        const pros = await products_model.find({ subcategory: this["id"] });
        pros.forEach(async (v) => {
            await v.deleteOne();
        });
        const brands = await brand_model.find({ subcategory: this["id"] });
        brands.forEach(async (v) => {
            await v.deleteOne();
        });
    }
);
const subcategory_model = model("subcategory", subcategory_schema);
export default subcategory_model;
