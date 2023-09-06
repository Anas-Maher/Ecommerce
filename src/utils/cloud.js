import { v2 as cloud } from "cloudinary";
import { cloud_name, api_key, api_secret } from "./Envs.js";
import "dotenv/config";
cloud.config({
    cloud_name,
    api_key,
    api_secret,
});
export default cloud