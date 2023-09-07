import { Types } from "mongoose";

const IsValidObjectId = (v, h) => {
    return !Types.ObjectId.isValid(v)
        ? h.message("parameter must be of type Object Id")
        : true;
};

export default IsValidObjectId;
