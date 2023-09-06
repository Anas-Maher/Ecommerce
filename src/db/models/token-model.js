import { Schema, Types, model } from "mongoose";
import { Expiration_Time } from "../../utils/Envs.js";

const token_schema = new Schema(
    {
        token: {
            type: String,
            required: true,
        },
        user: {
            type: Types.ObjectId,
            ref: "users",
            required: true,
        },
        "is-valid": {
            type: Boolean,
            default: true,
            required: true,
        },
        agent: String,
        "expires-at": String,
    },
    {
        timestamps: true,
        strictQuery: true,
        toJSON: { virtuals: true },
        toObject: {
            virtuals: true,
        },
    }
);

token_schema.pre("save", function () {
    this["expires-at"] = Expiration_Time;
});

const token_model = model("token", token_schema);

export default token_model;
