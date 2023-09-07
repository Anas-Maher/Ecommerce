import { Types } from "mongoose";
import cart_model from "../db/models/cart-model.js";
import products_model from "../db/models/product-model.js";
/**
 *
 * @param {Types.ObjectId} uuid
 */
export const clear_cart = async (uuid) => {
    const cart = await cart_model.findOneAndUpdate(
        { user: uuid },
        { $set: { products: [] } },
        { new: true }
    );
};
/**
 *
 * @param {import("../types").Pros} pros
 */
export const update_stock = async (pros, inc = true) => {
    if (inc) {
        for (const product of pros) {
            await products_model.findByIdAndUpdate(
                product?._id,
                {
                    $inc: {
                        "available-items": -product?.quantity,
                        "sold-items": +product?.quantity,
                    },
                },
                { new: true }
            );
        }
    } else {
        for (const product of pros) {
            await products_model.findByIdAndUpdate(
                product?._id,
                {
                    $inc: {
                        "available-items": +product?.quantity,
                        "sold-items": -product?.quantity,
                    },
                },
                { new: true }
            );
        }
    }
};
