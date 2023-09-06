import { Router } from "express";
import { Is_Authenticated } from "../middleware/authentication.js";
import { Is_Authorized } from "../middleware/authorization.js";
import is_valid from "../middleware/validator.js";
import {
    create_category_schema,
    delete_category_schema,
    update_category_schema,
} from "../validation/category-schema.js";
import upload from "../utils/upload.js";
import { valid_uploads } from "../utils/Envs.js";
import {
    all_catagories,
    create_category,
    delete_category,
    update_category,
} from "../controllers/category-controller.js";
const categories_router = Router();
categories_router.post(
    "/add",
    Is_Authenticated,
    Is_Authorized("seller"),
    upload(valid_uploads.images).single("photo"),
    is_valid(create_category_schema),
    create_category
);
categories_router.patch(
    "/update/:id",
    Is_Authenticated,
    Is_Authorized("seller"),
    upload(valid_uploads.images).single("photo"),
    is_valid(update_category_schema),
    update_category
);

categories_router.delete(
    "/delete/:id",
    Is_Authenticated,
    Is_Authorized("seller"),
    is_valid(delete_category_schema),
    delete_category
);
categories_router.get("/", all_catagories);
export default categories_router;
