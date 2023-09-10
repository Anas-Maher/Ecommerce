import express from "express";
import "dotenv/config";
import Start from "./src/Start.js";
import { port } from "./src/utils/Envs.js";
const app = express();
console.error('please edit .env file to your configs , this is from index')
// await Start(app, express);
app.listen(port, () => {
    console.log("up");
});
