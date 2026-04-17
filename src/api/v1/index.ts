import Router from "@koa/router";
import jwtVerif from "#/middelware/jwt";
import fails from "./fails";
import send from "#/api/v1/send";
import sendBatch from "#/api/v1/sendBatch";
import unsubscribe from "./unsubscribe";
import subscribe from "./subscribe";

const v1Router: Router = new Router({ prefix: "/v1" });

v1Router.use(jwtVerif);

v1Router.get("/fails", fails);
v1Router.post("/send", send);
v1Router.post("/send-batch", sendBatch);
v1Router.post("/subscribe", subscribe);
v1Router.post("/unsubscribe", unsubscribe);

export default v1Router;
