import mongoose from "mongoose";
import { db_url } from "../utils/Envs.js";
const Connect = async () => {
    try {
        const db = await mongoose?.connect(db_url, {
            connectTimeoutMS: 30_000,
        });
        console.log("db running");
        return db;
    } catch (error) {}
};

export default Connect;
