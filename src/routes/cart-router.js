import { Router } from "express";
import { Is_Authenticated } from "../middleware/authentication.js";
import { Is_Authorized } from "../middleware/authorization.js";
import is_valid from "../middleware/validator.js";
import {
    add2cart_schema,
    remove_product_cart_schema,
    update_cart_schema,
} from "../validation/cart-schema.js";
import {
    add2cart,
    user_cart,
    update_cart,
    remove_product_from_cart,
    remove_cart,
} from "../controllers/cart-controller.js";
const cart_router = Router();
cart_router.post("/add", Is_Authenticated, is_valid(add2cart_schema), add2cart);
cart_router.get("/", Is_Authenticated, user_cart);
cart_router.patch(
    "/",
    Is_Authenticated,
    Is_Authorized("seller"),
    is_valid(update_cart_schema),
    update_cart
);
cart_router.patch(
    "/remove-product/:product_id",
    Is_Authenticated,
    Is_Authorized("seller"),

    is_valid(remove_product_cart_schema),
    remove_product_from_cart
);
cart_router.patch(
    "/clear",
    Is_Authenticated,
    Is_Authorized("seller"),
    remove_cart
);
export default cart_router;
