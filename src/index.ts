// https://github.com/tonyghiani/koa-template

import { createServer } from "http";
import app from "#/app";
import { port } from "#/config"

async function main() {
    return createServer(app.callback()).listen(port);
}

function exitMain() {
    process.exit();
}

main().then(() => {
    console.log(`🚀 Server listening on http://localhost:${port} !`);
}).catch((err: any) => {
    setImmediate(() => {
        console.error(
            "Unable to run the server because of the following error:"
        );
        console.error(err);
        exitMain();
    });
});
