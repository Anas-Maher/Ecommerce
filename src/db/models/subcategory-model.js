import { Schema, Types, model } from "mongoose";
import Format from "../../utils/SearchFormatter.js";

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

const subcategory_model = model("subcategory", subcategory_schema);
export default subcategory_model;
