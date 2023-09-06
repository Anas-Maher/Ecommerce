/**
 *
 * @param {import("express").NextFunction} next
 * @returns {import("../types").Call_Next}
 */
const NextError = (next) => {
    /**
     *
     * @param {string} msg
     * @param {number} cause
     */
    return {
        /**
         *
         * @param {string | {[key : PropertyKey] : unknown}} msg
         * @param {number} cause http status code
         */
        CallNext(msg, cause = 500) {
            return next(
                new Error(typeof msg === "string" ? msg : msg?.toString(), {
                    cause,
                })
            );
        },
    };
};

export default NextError;
