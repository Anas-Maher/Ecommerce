/**
 *
 * @param {import("express").NextFunction} next
 * @returns {import("ts").Call_Next}
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
                new Error(
                    typeof msg === "string"
                        ? msg
                        : typeof msg === "number"
                        ? msg?.toString()
                        : JSON.stringify(msg),
                    {
                        cause,
                    }
                )
            );
        },
    };
};

export default NextError;
