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
/**
 *
 * @param {import('express').Express} app
 * @param {import("./types/index.js").Express} express
 */
const Start = async (app, express) => {
    try {
        app.use(cors());
        app.use(express.json());
        await Connect();
        app.use("/users", users_router);
        app.use("/category", categories_router);
        app.use("/subcategory", subcategory_router);
        app.use("/brands", brands_router);
        app.use("/products", products_router);
        app.use("/coupons", coupons_router);
        app.use("/cart", cart_router);
        app.use("/order", order_router);
        app.use("*", (_, s) => s.json("Check Url And Method please "));
        app.use(GlobalErrorHandler);
    } catch (error) {
        console.error(error);
    }
};
export default Start;
