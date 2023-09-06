import express from "express";
import "dotenv/config";
import Start from "./src/Start.js";
import { port } from "./src/utils/Envs.js";
const app = express();
await Start(app , express)
app.listen(port, () => {
    console.log(`http://localhost:${port}/`);
});
         