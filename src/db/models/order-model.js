import { Schema, Types, model } from "mongoose";
/**
 * @type {Array<import("../../types/index.js").Shipping>}
 */
export const shipping_status = [
    "placed",
    "shipping",
    "delivered",
    "canceled",
    "refund",
];
export const order_schema = new Schema(
    {
        user: { type: Types.ObjectId, ref: "users", required: true },
        products: [
            {
                type: Types.ObjectId,
                ref: "products",
                _id: false,
                required: true,
                name: String,
                "item-price": Number,
                "total-price": Number,
                quantity: { type: Number, min: 1, required: true },
            },
        ],
        invoice: {
            secure_url: String,
            public_id: String,
        },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        "order-total-price": { type: Number, required: true },
        coupon: {
            id: { type: Types.ObjectId, ref: "coupon" },
            name: String,
            discount: { type: Number, min: 1, max: 100 },
        },
        status: {
            type: String,
            enum: shipping_status,
            default: shipping_status[0],
        },
        "payment-method": {
            type: String,
            enum: ["card", "cash"],
            default: "card",
        },
    },
    {
        timestamps: true,
        strictQuery: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
order_schema.virtual("final_price").get(function () {
    if (this.coupon) {
        const p = Number(this["order-total-price"]) || 1;
        const d = Number(this?.coupon?.discount) || 0;
        return (p - (p - d) / 100).toFixed(2);
    }
    return this?.["order-total-price"];
});
const order_model = model("orders", order_schema);
export default order_model;
