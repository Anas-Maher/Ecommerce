import { Router } from "express";
import is_valid from "../middleware/validator.js";
import {
    confirm_email,
    forget_password,
    login,
    reset_password,
    signup,
} from "../controllers/users-controller.js";
import {
    forget_password_schema,
    login_schema,
    reset_password_schema,
    signup_schema,
} from "../validation/users-schema.js";
const users_router = Router();
//users
users_router.post("/register/signup", is_valid(signup_schema), signup);
users_router.get(
    "/confirm-email/:token",
    is_valid(confirm_email),
    confirm_email
);
users_router.post("/register/login", is_valid(login_schema), login);
users_router.patch(
    "/forget-password",
    is_valid(forget_password_schema),
    forget_password
);
users_router.patch(
    "/reset-password",
    is_valid(reset_password_schema),
    reset_password
);

export default users_router;
