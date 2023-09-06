import coupon_model from "../db/models/coupon-model.js";
import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import NextError from "../utils/NextError.js";
import { randomBytes } from "crypto";

export const create_coupon = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { discount, expires_at } = req.body;
    const name = randomBytes(16).toString("hex");
    const coupon = await coupon_model.create({
        "discount-percentage": discount,
        creator: req.user._id,
        name,
        expires_at,
    });
    return res.status(201).json({ done: true, payload: coupon });
});

export const update_coupon = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { code } = req.params;
    const { discount, expires_at } = req.body;
    const coupon = await coupon_model.findOne({
        $and: [{ name: code }, { expires_at: { $gt: Date.now() } }],
    });
    if (!coupon) {
        return CallNext("no coupon found", 404);
    }
    await coupon.updateOne(
        {
            $set: {
                "discount-percentage":
                    discount ?? coupon["discount-percentage"],
                expires_at: expires_at ?? coupon.expires_at,
            },
        },
        { new: true }
    );
    return res.status(201).json({ done: true, payload: coupon });
});
export const delete_coupon = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { code } = req.params;
    const coupon = await coupon_model.findOne({
        name: code,
    });
    if (!coupon) {
        return CallNext("no coupon found", 404);
    }
    await coupon.deleteOne();
    return res.status(201).json({ done: true, payload: "deleted !" });
});

export const all_coupons = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const all = coupon_model.find({ expires_at: { $gt: Date.now() } });
    return res.json({ done: true, payload: all });
});
