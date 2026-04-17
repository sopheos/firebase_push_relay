import { Context } from "koa";
import HttpError from "#/lib/HttpError";

export default async (ctx: Context, next: () => any) => {
    try {
        await next();
        if ((ctx.status || 404) === 404) {
            throw new HttpError(404, "route_not_found");
        }
    } catch (err: any) {
        if (err instanceof HttpError) {
            ctx.status = err.status;
            ctx.body = { error: err.error, errors: err.errors };
        } else {
            // TODO log de l'erreur
            ctx.status = err.status || 500;
            ctx.body = { error: err.message };
        }
    }
};
