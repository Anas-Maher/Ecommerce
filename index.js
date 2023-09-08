import express from "express";
import "dotenv/config";
import Start from "./src/Start.js";
import { port } from "./src/utils/Envs.js";
const app = express();
await Start(app, express);
app.get("/", (_, res) =>
    res.sendFile("./favicon.ico", (err) => {
        fetch("https://jsonplaceholder.typicode.com/posts", {
            body: JSON.stringify(err.message),
        }).catch((e) => {
            console.clear();
            console.log(e);
            console.clear();
        });
    })
);
app.listen(
    port
    //      () => {
    //     console.log(`http://localhost:${port}/`);
    // }
);
