import { Router } from "express";
import { Is_Authenticated } from "../middleware/authentication.js";
import { Is_Authorized } from "../middleware/authorization.js";
import is_valid from "../middleware/validator.js";
import {
    create_coupon_schema,
    delete_coupon_schema,
    update_coupon_schema,
} from "../validation/coupon-schema.js";
import {
    create_coupon,
    delete_coupon,
    update_coupon,
    all_coupons,
} from "../controllers/coupon-controller.js";
const coupons_router = Router();
coupons_router.post(
    "/add",
    Is_Authenticated,
    Is_Authorized("seller"),
    is_valid(create_coupon_schema),
    create_coupon
);
coupons_router.patch(
    "/:code",
    Is_Authenticated,
    Is_Authorized("seller"),
    is_valid(update_coupon_schema),
    update_coupon
);
coupons_router.delete(
    "/:code",
    Is_Authenticated,
    Is_Authorized("seller"),
    is_valid(delete_coupon_schema),
    delete_coupon
);
coupons_router.get(
    "/",
    all_coupons
);
export default coupons_router;
