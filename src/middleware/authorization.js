import AsyncErrorHandler from "../utils/AsyncErrorHandler.js";
import NextError from "../utils/NextError.js";
/**
 *
 * @param {import("../types").users_role} role
 * @returns {import("../types").Error_Handler}
 */
export const Is_Authorized = (role) => {
    return AsyncErrorHandler(async (req, _res, next) => {
        const { CallNext } = NextError(next);
        if (
            role?.toLowerCase().trim() !==
            req?.user?.role?.toLowerCase()?.trim()
        ) {
            return CallNext("you are not authorized", 403);
        }
        return next();
    });
};
