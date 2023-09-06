import { Schema, Types, model } from "mongoose";
import Format from "../../utils/SearchFormatter.js";
import subcategory_model from "./subcategory-model.js";

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
category_schema.pre("save", function () {
    this["search-name"] = Format(this["display-name"] + "@yea");
});
category_schema.virtual('subs', {
    ref: "subcategory",
    localField: "_id",
    foreignField: "parent-category",
});

const category_model = model("category", category_schema);

export default category_model;
