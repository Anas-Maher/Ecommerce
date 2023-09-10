import cors from "cors";
import Connect from "./db/Connect.js";
import GlobalErrorHandler from "./utils/GlobalErrorHandler.js";
import users_router from "./routes/users-router.js";
import categories_router from "./routes/categories-router.js";
import subcategory_router from "./routes/subcategory-router.js";
import brands_router from "./routes/brand-router.js";
import products_router from "./routes/product-router.js";
import coupons_router from "./routes/coupon-router.js";
import cart_router from "./routes/cart-router.js";
import order_router from "./routes/order-router.js";
import NextError from "./utils/NextError.js";
import reviews_router from "./routes/reviews-router.js";
import "dotenv/config";
const allowed_domains = ["http://127.0.0.1:5500"];
/**
 *
 * @param {import('express-serve-static-core').Express} app
 * @param {import("./types").Express} express
 */
const Start = async (app, express) => {
    try {
        if (process.env?.testing !== "yes") {
            app.use((req, res, next) => {
                if (req.originalUrl.includes("/users/confirm-email")) {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Access-Control-Allow-Methods", "GET");
                    return next();
                }
                if (!allowed_domains.includes(req?.headers?.origin)) {
                    return NextError(next).CallNext("Blocked By Cors", 401);
                }
                res.setHeader("Access-Control-Allow-Headers", "*");
                res.setHeader(
                    "Access-Control-Allow-Methods",
                    "GET PATCH DELETE POST"
                );
                res.setHeader("Access-Control-Allow-Private-Network", true);
                return next();
            });
        } else {
        }
        app.use(cors());
        app.use((q, _, n) => {
            if (q.originalUrl.includes("/order/webhook")) {
                return n();
            }
            express.json()(q, _, n);
        });
        await Connect();
        app.get("/", (_, res) => res.json("Welcome to my project"));
        app.use("/users", users_router);
        app.use("/category", categories_router);
        app.use("/subcategory", subcategory_router);
        app.use("/brands", brands_router);
        app.use("/products", products_router);
        app.use("/coupons", coupons_router);
        app.use("/reviews", reviews_router);
        app.use("/cart", cart_router);
        app.use("/order", order_router);
        app.use("*", (_, s) =>
            s.json(
                "Welcome To my website , looks like you visited the wrong route!"
            )
        );
        app.use(GlobalErrorHandler);
    } catch (error) {}
};
export default Start;
