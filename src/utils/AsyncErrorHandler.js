/**
 *
 * @param {import('ts').Fn} fn
 * @param {number} status http status code  
 * @returns {import('ts').Error_Handler}
 */
const AsyncErrorHandler = (fn, status = 400) => {
    /** */
    /** */
    return (req, res, _next) => {
        /** */
        /** */
        return fn(req, res, _next)?.catch(
            /**
             *
             * @param {Error} error
             * @returns {import('express').Request}
             */
            (error) => {
                return res?.status(status)?.json({
                    error: error?.message ?? "Internal Server Error",
                    stack: error?.stack,
                });
            }
        );
    };
};
export default AsyncErrorHandler;
