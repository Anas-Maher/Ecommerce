import { Schema, Types, model } from "mongoose";

export const brand_schema = new Schema(
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
        "subcategory-id": {
            type: Types.ObjectId,
            ref: "subcategory",
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

const brand_model = model("brand", brand_schema);

export default brand_model;
