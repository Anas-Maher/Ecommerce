import multer, { diskStorage } from "multer";

/**
 *
 * @param {string[]} filter
 * @returns
 */
export const upload = (filter) => {
    /**
     *
     * @param {import("express").Request} _req
     * @param {import("../types").File} file
     * @param {multer.FileFilterCallback} cb
     */
    const fileFilter = (_req, file, cb) => {
        if (!filter.includes(file.mimetype)) {
            return cb(new Error("invalid file type"), false);
        }
        return cb(null , true)
    };
    return multer({ storage: diskStorage({}), fileFilter });
};

export default upload;
