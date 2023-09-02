import "dotenv/config";
export const login_page = "http://localhost:5173/login";
export const signup_page = "http://localhost:5173/signup";
export const jwt_signature = process.env?.["jwt-signature"];
export const db_url = process.env?.["db-url"];
export const email = process.env?.email;
export const password = process.env?.password;
export const inner_password_secret = process.env?.["inner-password-secret"];
export const outer_password_secret = process.env?.["outer-password-secret"];
