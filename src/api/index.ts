import { Context } from "koa";
import Router from "@koa/router";
import v1Router from "#/api/v1";

const apiRouter: Router = new Router();
const deprecatedRouter: Router = new Router();

// -------------------------------------------------------------------------------------
// |              Modify these two values to set the version support.                  |
// -------------------------------------------------------------------------------------
const currentVersion: number = 1;
const minSupportedVersion: number = 1;

const versionGet = (ctx: Context) => {
  ctx.body = {
    currentVersion,
    minSupportedVersion,
  };
};

function deprecated(ctx: Context) {
  ctx.status = 410;
}

for (let version = 1; version < minSupportedVersion; version++) {
  deprecatedRouter.all(`/v${version}{/*path}`, deprecated);
}

apiRouter.get("/", versionGet);
apiRouter.use(deprecatedRouter.routes());

// -------------------------------------------------------------------
// |                       Version routers                           |
// -------------------------------------------------------------------
apiRouter.use(v1Router.routes());

export default apiRouter;
