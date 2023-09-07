import { Router } from "express";
import { Is_Authenticated } from "../middleware/authentication.js";
import { Is_Authorized } from "../middleware/authorization.js";
import upload from "../utils/upload.js";
import { valid_uploads } from "../utils/Envs.js";
import is_valid from "../middleware/validator.js";
import {
    add_product_schema,
    productId_schema,
} from "../validation/product-schema.js";
import {
    add_product,
    all_products,
    delete_product,
    search_products,
    single_product,
    category_product,
} from "../controllers/product-controller.js";
const products_router = Router({mergeParams:true});
products_router.post(
    "/add",
    Is_Authenticated,
    Is_Authorized("seller"),
    upload(valid_uploads.images).fields([
        { name: "source", maxCount: 1 },
        { name: "view", maxCount: 3 },
    ]),
    is_valid(add_product_schema),
    add_product
);
products_router.delete(
    "/:id",
    Is_Authenticated,
    Is_Authorized("seller"),
    is_valid(productId_schema),
    delete_product
);
products_router.get("/all", all_products);
products_router.get("/search", search_products);
products_router.get("/single/:id", is_valid(productId_schema), single_product);
products_router.get("/category/:id", is_valid(productId_schema), category_product);
export default products_router;
