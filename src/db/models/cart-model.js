import { Schema, Types, model } from "mongoose";
const cart_schema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "user",
            unique: true,
            required: true,
        },
        products: [
            {
                _id: false,
                "product-id": {
                    type: Types.ObjectId,
                    ref: "product",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
        strictQuery: true,
        // toJSON: { virtuals: true },
        // toObject: { virtuals: true },
    }
);

const cart_model = model("cart", cart_schema);
export default cart_model;
