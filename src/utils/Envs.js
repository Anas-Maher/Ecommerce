import "dotenv/config";
export const login_page = "http://localhost:5173/login";
export const signup_page = "http://localhost:5173/signup";
export const jwt_signature = process.env?.jwt_signature;
export const db_url = process.env?.db_url;
export const port = +process.env?.port || 5000;
export const email = process.env?.email;
export const password = process.env?.password;
export const cloud_name = process.env?.cloud_name;
export const api_key = process.env?.api_key;
export const api_secret = process.env?.api_secret;
export const rounds = +process.env?.rounds || 10;
export const Expiration_Time = 172800;
export const folder_name = "ecommerce-uploads";

export const valid_uploads = Object.freeze({
    images: Object.freeze(["image/png", "image/jpeg"]),
});
