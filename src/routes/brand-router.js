import { Router } from "express";
import { Is_Authenticated } from "../middleware/authentication.js";
import { Is_Authorized } from "../middleware/authorization.js";
import is_valid from "../middleware/validator.js";
import {
    create_brand_schema,
    delete_brand_schema,
    update_brand_schema,
} from "../validation/brand-schema.js";
import upload from "../utils/upload.js";
import { valid_uploads } from "../utils/Envs.js";
import {
    all_brands,
    create_brand,
    delete_brand,
    update_brand,
} from "../controllers/brand-controller.js";
const brands_router = Router();
brands_router.post(
    "/add",
    Is_Authenticated,
    Is_Authorized("seller"),
    upload(valid_uploads.images).single("photo"),
    is_valid(create_brand_schema),
    create_brand
);
brands_router.patch(
    "/update/:id",
    Is_Authenticated,
    Is_Authorized("seller"),
    upload(valid_uploads.images).single("photo"),
    is_valid(update_brand_schema),
    update_brand
);

brands_router.delete(
    "/delete/:id",
    Is_Authenticated,
    Is_Authorized("seller"),
    is_valid(delete_brand_schema),
    delete_brand
);
brands_router.get("/", all_brands);
export default brands_router;
