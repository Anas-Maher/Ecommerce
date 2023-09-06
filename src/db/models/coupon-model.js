import { Schema, Types, model } from "mongoose";
const coupon_schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        "discount-percentage": {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
        creator: {
            type: Types.ObjectId,
            ref: "users",
            required: true,
        },
        expires_at: {
            type: String,
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
const coupon_model = model("coupon", coupon_schema);
export default coupon_model;
