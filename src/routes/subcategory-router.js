import { Router } from "express";
import { Is_Authenticated } from "../middleware/authentication.js";
import { Is_Authorized } from "../middleware/authorization.js";
import upload from "../utils/upload.js";
import { valid_uploads } from "../utils/Envs.js";
import is_valid from "../middleware/validator.js";
import { create_subcategory_schema, delete_subcategory_schema, update_subcategory_schema } from "../validation/subcategory-schema.js";
import {
    create_subcategory,
    update_subcategory,
    delete_subcategory,
    all_subcategories,
} from "../controllers/subcategory-controller.js";

const subcategory_router = Router();
subcategory_router.post(
    "/add",
    Is_Authenticated,
    Is_Authorized("seller"),
    upload(valid_uploads.images).single("photo"),
    is_valid(create_subcategory_schema),
    create_subcategory
);
subcategory_router.patch(
    "/update/:id",
    Is_Authenticated,
    Is_Authorized("seller"),
    upload(valid_uploads.images).single("photo"),
    is_valid(update_subcategory_schema),
    update_subcategory
);
subcategory_router.delete(
    "/delete/:id",
    Is_Authenticated,
    Is_Authorized("seller"),
    is_valid(delete_subcategory_schema),
    delete_subcategory
);
subcategory_router.get("/", all_subcategories);
export default subcategory_router;
