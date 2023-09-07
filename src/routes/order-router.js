import {Router} from 'express'
import { Is_Authenticated } from '../middleware/authentication.js'
import { Is_Authorized } from '../middleware/authorization.js'
import is_valid from "../middleware/validator.js"
import { cancel_order_schema, create_order_schema } from '../validation/order-schema.js'
import { create_order, cancel_order } from "../controllers/order-controller.js";
const order_router = Router()
order_router.post(
    "/add",
    Is_Authenticated,
    is_valid(create_order_schema),
    create_order
);
order_router.patch(
    "/:id",
    Is_Authenticated,
    is_valid(cancel_order_schema),
    cancel_order
);
export default order_router