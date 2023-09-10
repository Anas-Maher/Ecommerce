import reviews_model from "../db/models/reviews-model.js";
import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import NextError from "../utils/NextError.js";

export const delete_review = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { review_id } = req.params;
    const review = await reviews_model.findByIdAndDelete(review_id);
    if (!review) {
        return CallNext("review not found", 404);
    }
    return res.json({ done: true, payload: 'deleted successfully' });
});
export const update_review = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { review_id } = req.params;
    let { content, title, rating } = req.body;
    const review = await reviews_model.findById(review_id);
    if (!review) {
        return CallNext("review not found", 404);
    }
    content ||= review?.content;
    title ||= review?.title;
    rating ||= review?.rating;
    await review.updateOne({ $set: { content, title, review } }, { new: true });
    return res.json({ done: true, payload: review });
});
export const add_review = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const { content, title, rating, product_id } = req.body;
    const is_review = await reviews_model.findOne({
        $and: [{ user: req?.user?._id, product: product_id }],
    });
    if (is_review) {
        return CallNext(
            "you can't add more than one review for this product",
            404
        );
    }
    const review = await reviews_model.create({
        content,
        title,
        product: product_id,
        rating,
        user: req?.user?._id,
    });
    return res.json({ done: true, payload: review });
});

export const get_all_reviews = AsyncErrorHandler(async (req, res, next) => {
    const { CallNext } = NextError(next);
    const all = await reviews_model.find().populate(["user", "product"]);
    return res.json({ done: true, payload: all });
});
