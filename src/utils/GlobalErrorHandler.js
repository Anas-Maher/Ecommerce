/**
 * @param {Error} error
 * @param {import('express').Request} _
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} __
 * @returns {import('express').Response}
 */
export const GlobalErrorHandler = (error, _, res, __) => {
    return res?.status(error?.cause ?? 500)?.json({
        error: error?.message ?? "Error",
    });
};
export default GlobalErrorHandler;
