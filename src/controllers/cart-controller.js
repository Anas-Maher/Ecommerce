import cart_model from "../db/models/cart-model.js";
import products_model from "../db/models/product-model.js";
import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import NextError from "../utils/NextError.js";

export const Add_To_Cart = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { product_id, quantity } = req.body;
    const product = await products_model.findById(product_id);
    if (!product) return CallNext("product not found", 404);
    if (!product?.enough_stock(quantity)) {
        return CallNext(
            `sorry only ${product?.["available-items"]} items is available now`
        );
    }
    const product_cart = await cart_model.findOneAndUpdate(
        { user: req?.user?._id },
        { $push: { products: { "product-id": product_id, quantity } } },
        { new: true }
        //
    );
    if (!product_cart) {
        return CallNext("cart not found!");
    }
    if (product_cart) {
        product_cart.products.forEach((item) => {
            if (
                (item["product-id"]?.toString(),
                product_id?.toString() &&
                    item?.quantity + quantity < product?.["available-items"])
            ) {
                item.quantity = quantity;
            }
        });
        await product_cart.save();
    }
    return res.json({ done: true, payload: product_cart });
});

export const user_cart = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const cart = await cart_model
        .findOne({ user: req?.user?._id })
        .populate("products.product-id", "name default-image.public_id");
    if (!cart) {
        return CallNext("No cart found", 404);
    }
    return res.json({ done: true, payload: cart });
});

export const update_cart = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { product_id, quantity } = req.body;
    const product = await products_model.findById(product_id);
    if (!product) return CallNext("product not found", 404);
    const cart = await cart_model.findOneAndUpdate(
        { user: req?.user?._id, "products.product-id": product_id },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
    );
    if (!cart) {
        return CallNext("cart not found!", 404);
    }
    if (cart) {
        // Todo Use Spread Operator And GEt The Whole Quantity
        // Complete Stripe , Fix Invoice , WebSockets?
        for (let i = 0; i < cart.products.length; i++) {
            const first_product = cart.products[i];
            const second_product = cart.products[i + 1];
            if (second_product != null && first_product != null) {
                if (
                    first_product["product-id"]?.toString() ===
                        second_product["product-id"]?.toString() &&
                    first_product?.quantity + second_product?.quantity <
                        product?.["available-items"] * 2
                ) {
                    first_product.quantity += second_product?.quantity;
                    second_product.quantity = 1_000_000;
                    await product.save();
                }
            }
        }
        const _cart = await cart_model.find({
            "products.quantity": 1_000_000,
        });
        _cart.forEach(async (v) => {
            await v.updateOne({ $pull: { "products.quantity": { $gt: 250 } } });
        });
        await cart.save();
    }
    return res.json({ done: true, payload: cart });
});
export const remove_product_from_cart = AsyncErrorHandler(
    async (req, res, next) => {
        const { CallNext } = NextError(next);
        const { product_id } = req.params;
        const cart = await cart_model.findOneAndUpdate(
            {
                user: req?.user?._id,
            },
            { $pull: { products: { "product-id": product_id } } },
            { new: true }
        );
        if (!cart) {
            return CallNext("cart not found!", 404);
        }
        return res.json({ done: true, payload: "deleted!" });
    }
);

export const remove_cart = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const cart = await cart_model.findOneAndUpdate(
        { user: req?.user?._id },
        { $set: { products: [] } },
        { new: true }
    );
    if (!cart) {
        return CallNext("product not in cart please add it first found!", 404);
    }
    return res.json({ done: true, payload: "deleted!" });
});
