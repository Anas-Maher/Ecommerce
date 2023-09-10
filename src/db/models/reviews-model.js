import { Schema, Types, model } from "mongoose";
const reviews_schema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        user: {
            type: Types.ObjectId,
            ref: "users",
            required: true,
        },
        product: {
            type: Types.ObjectId,
            ref: "product",
            required: true,
        }, 
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    {
        timestamps: true,
        strictQuery: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
const reviews_model = model("reviews", reviews_schema);
export default reviews_model;
