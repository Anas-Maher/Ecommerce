import token_model from "../db/models/token-model.js";
import users_model from "../db/models/users-models.js";
import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import { jwt_signature } from "../utils/Envs.js";
import NextError from "../utils/NextError.js";
import jwt from "jsonwebtoken";

export const Is_Authenticated = AsyncErrorHandler(async (req, res, next) => {
    const _token = req.headers?.token;
    const { CallNext } = NextError(next);
    if (_token == null) return CallNext("token is required", 400);
    /**
     * @type {import("../types/index.js").token_shape}
     */
    const decoded = jwt.decode(_token);
    if (!decoded) {
        return CallNext("invalid token", 403);
    }
    const token = await token_model.findOne({
        $and: [{ token: _token, "is-valid": true }],
    });
    if (!token) {
        return CallNext("token expired", 403);
    }
    const user = await users_model.findOne({ email: decoded.email });
    if (!user) {
        return CallNext("user not found", 404);
    }
    req.user = user;
    return next();
});
