import { Schema, model } from "mongoose";
import { rounds } from "../../utils/Envs.js";
import bcryptjs from "bcryptjs";
export const users_schema = new Schema(
    {
        "user-name": {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female"],
        },
        status: {
            type: String,
            enum: ["online", "offline"],
            required: true,
            default: "offline",
        },
        role: {
            type: String,
            required: true,
            enum: ["buyer", "seller"],
            default: "buyer",
        },
        "is-confirmed": {
            type: Boolean,
            required: true,
            default: false,
        },
        phone: String,
        "activation-code": String,
        "forget-code": String,
        "profile-picture": {
            "secure-url": {
                type: String,
                default:
                    "https://res.cloudinary.com/doqwsws5n/image/upload/v1693920906/kjvv6ylenroe8bisdoxn.png",
                required: true,
            },
            "public-id": {
                type: String,
                default: "v1693920906/kjvv6ylenroe8bisdoxn",
                required: true,
            },
        },
        "cover-image": {
            "secure-url": {
                type: String,
                default:
                    "https://res.cloudinary.com/doqwsws5n/image/upload/v1693920906/kjvv6ylenroe8bisdoxn.png",
                required: true,
            },
            "public-id": {
                type: String,
                default: "v1693920906/kjvv6ylenroe8bisdoxn",
                required: true,
            },
        },
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
users_schema.pre("save", function () {
    this.password = bcryptjs.hashSync(this.password, rounds);
});

const users_model = model("users", users_schema);

export default users_model;
