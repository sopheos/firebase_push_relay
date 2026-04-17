import Koa from "koa";
import bodyParser from "@koa/bodyparser";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import errorHandler from "#/middelware/errorHandler";
import apiRouter from "#/api";

const app = new Koa();

app.use(errorHandler);
app.use(bodyParser());
app.use(cors());
app.use(helmet());

app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

export default app;
