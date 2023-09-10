import cart_model from "../db/models/cart-model.js";
import coupon_model from "../db/models/coupon-model.js";
import order_model from "../db/models/order-model.js";
import products_model from "../db/models/product-model.js";
import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import NextError from "../utils/NextError.js";
import createInvoice from "../utils/CreateInvoice.js";
import { join } from "path";
import { dirname, folder_name, stripe_key } from "../utils/Envs.js";
import cloud from "../utils/cloud.js";
import SendMail from "../utils/SendMail.js";
import { clear_cart, update_stock } from "../utils/Cart.js";
import { unlink } from "fs";
import Stripe from "stripe";

export const create_order = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { address, coupon, phone, payment } = req.body;
    if (coupon) {
        var check_coupon = await coupon_model.findOne({
            name: coupon,
            expires_at: { $gt: Date.now() },
        });
    }
    const cart = await cart_model.findOne({ user: req?.user?._id });
    if (!cart) {
        return CallNext("Cart Not Found!", 404);
    }
    if (cart?.products?.length < 1) {
        return CallNext("Empty Cart !", 401);
    }
    let order_products = [];
    let order_price = 0;
    for (let i = 0; i < cart?.products?.length; i++) {
        const product = cart?.products?.[i];
        const item = await products_model.findById(product["product-id"]);
        if (!item) {
            return CallNext(`product not Found!`, 404);
        }
        if (!item?.enough_stock(product?.quantity)) {
            return CallNext(
                `${item?.name} out of stock only ${item?.["available-items"]} are available`
            );
        }
        order_products.push({
            "product-id": product?._id,
            name: item?.name,
            "item-price": product?.final_price || 1,
            "total-price": product?.quantity * (product?.final_price || 1),
            quantity: product?.quantity,
        });
        order_price += product?.quantity * (product?.final_price || 1);
    }
    let total_order_price = order_price;
    if (check_coupon) {
        total_order_price =
            (check_coupon?.["discount-percentage"] / order_price) * 100;
    }
    const order = await order_model.create({
        "order-total-price": total_order_price?.toFixed(2),
        address,
        phone,
        coupon: {
            id: check_coupon?._id,
            name: check_coupon?.name,
            discount: check_coupon?.["discount-percentage"],
        },
        "payment-method": payment,
        user: req?.user?._id,
    });
    const invoice = {
        shipping: {
            name: req?.user?.["user-name"],
            address: order?.address,
            country: "EGYPT",
            postal_code: 11511,
        },
        items: order?.products,
        subtotal: order_price,
        paid: order?.["order-total-price"],
        invoice_nr: order?._id?.toString(),
    };
    const pdf_path = join(dirname, `../.../../../pdf/${order._id}.pdf`);
    createInvoice(invoice, pdf_path);
    const { secure_url, public_id } = await cloud.uploader.upload(pdf_path, {
        folder: `${folder_name}/order-invoice/${req?.user?._id}`,
    });
    unlink(pdf_path, (err) => {
        if (err) {
            return CallNext("Internal Server Error");
        }
    });
    await order.updateOne(
        { $set: { invoice: { secure_url, public_id } } },
        { new: true }
    );
    const is_sent = await SendMail({
        to: req?.user?.email,
        subject: "Invoice",
        attachments: [{ contentType: "application/pdf", path: secure_url }],
    });
    if (!is_sent) {
        return CallNext(
            "sorry we could not send an email but your order has been place please call the support or cancel the order"
        );
    }
    if (payment === "card") {
        const stripe = new Stripe(stripe_key);
        if (order?.coupon?.name != undefined) {
            var is_coupon = await stripe.coupons.create({
                percent_off: order?.coupon?.discount,
                duration: "once",
            });
        }
        const stripe_session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            metadata: {
                order_id: order._id.toString(),
                products: order?.products,
                uuid: req?.user?._id,
            },
            // todo add website
            success_url: "https://google.com",
            cancel_url: "https://facebook.com",
            line_items: order_products.map((product) => {
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: product.name,
                        },
                        unit_amount: product["item-price"] * 100,
                    },
                    quantity: product?.quantity,
                };
            }),
            discounts: is_coupon ? [{ coupon: is_coupon.id }] : [],
        });
        return res.json({ done: true, payload: stripe_session.url });
    }
    return res.json({ done: true, payload: "check your inbox please" });
});

export const cancel_order = AsyncErrorHandler(async ({ params }, res, next) => {
    const { CallNext } = NextError(next);
    const { id } = params;
    const order = await order_model.findById(id);
    if (!order) {
        return CallNext("order not found", 404);
    }
    if (order?.status === "shipped" || order.status === "delivered") {
        return CallNext("you can not cancel this order!", 401);
    }
    if (order?.status === "canceled") {
        return CallNext("order is already canceled", 401);
    }
    await order.updateOne({ $set: { status: "canceled" } }, { new: true });
    await update_stock(order.products, false);
    return res.json({ done: true, payload: "canceled successfully" });
});

export const webhook = AsyncErrorHandler(async (req, res, next) => {
    const sig = req.headers["stripe-signature"];
    const stripe = new Stripe(stripe_key);
    try {
        var event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            webhook_secret
        );
    } catch (err) {
        return res.status(400).json(`Webhook Error: ${err?.message}`);
    }
    const { order_id, products, uuid } = event.data.object.metadata;
    //todo if it does not work return it up
    if (event.type === "checkout.session.completed") {
        await Promise.allSettled([
            await order_model.findOneAndUpdate(
                { _id: order_id },
                { status: "payed" }
            ),
            await update_stock(products),
            await clear_cart(uuid),
        ]);
        return;
    }
    await order_model.findOneAndUpdate({ _id: order_id }, { status: "failed" });
    return;
});
