import { Router } from "express";
import { Is_Authenticated } from "../middleware/authentication.js";
import { Is_Authorized } from "../middleware/authorization.js";
import is_valid from "../middleware/validator.js";
import {
    add_review_schema,
    delete_review_schema,
    update_review_schema,
} from "../validation/reviews-schema.js";
import {
    add_review,
    delete_review,
    get_all_reviews,
    update_review,
} from "../controllers/reviews-controller.js";
const reviews_router = Router();
reviews_router.post(
    "/",
    Is_Authenticated,
    Is_Authorized("buyer"),
    is_valid(add_review_schema),
    add_review
);
reviews_router.get("/", get_all_reviews);
reviews_router.patch(
    "/:review_id",
    Is_Authenticated,
    Is_Authorized("buyer"),
    is_valid(update_review_schema),
    update_review
);
reviews_router.delete(
    "/:review_id",
    Is_Authenticated,
    Is_Authorized("buyer"),
    is_valid(delete_review_schema),
    delete_review
);
export default reviews_router;
