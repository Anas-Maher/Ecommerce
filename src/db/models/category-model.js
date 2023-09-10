import { Schema, Types, model } from "mongoose";
import Format from "../../utils/SearchFormatter.js";
import subcategory_model from "./subcategory-model.js";
import products_model from "./product-model.js";

export const category_schema = new Schema(
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
category_schema.pre("save", { document: true, query: false }, function () {
    this["search-name"] = Format(this["display-name"]);
});
category_schema.post(
    "deleteOne",
    { document: true, query: false },
    async function () {
        const subs = await subcategory_model.find({
            "parent-category": this?.["_id"],
        });
        subs.forEach(async (sub) => {
            await sub.deleteOne();
        });
        const pros = await products_model.find({
            "parent-category": this?.["_id"],
        });
        pros.forEach(async (pro) => {
            await pro.deleteOne();
        });
        const brand = await subcategory_model.find({
            "parent-category": this?.["_id"],
        });
        brand.forEach(async (sub) => {
            await sub.deleteOne();
        });
    }
);
category_schema.pre(
    "deleteOne",
    { document: true, query: false },
    async function () {
        if (this) {
            await subcategory_model.deleteMany({
                "parent-category": this?.["_id"],
            });
        }
    }
);
category_schema.virtual("subs", {
    ref: "subcategory",
    localField: "_id",
    foreignField: "parent-category",
});

const category_model = model("category", category_schema);

export default category_model;
