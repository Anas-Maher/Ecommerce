import NextError from "../utils/NextError.js";
/**
 *  @param {{[key : PropertyKey] : import("joi").Schema}} schema
 *  @returns {import("../types/index.js").Fn}
 */
const is_valid = (schema) => {
    const args = ["body", "params", "query", "headers", "file"];
    return (req, _, next) => {
        const { CallNext } = NextError(next);
        const errors = [];
        args.forEach((key) => {
            if (schema?.[key]) {
                const result = schema?.[key]?.validate(req?.[key], {
                    abortEarly: false,
                });
                if (result?.error) {
                    errors.push(result?.error?.details);
                }
            }
        });
        if (errors?.length) {
            return CallNext(
                JSON.stringify(
                    errors?.[0]
                        .map((v) => v?.message ?? v)
                        .join(" ")
                        .split("required")
                        .join("required,")
                )?.replaceAll(/\\|"|'|\n/gim, ""),
                400
            );
        }
        return next();
    };
};

export default is_valid;
