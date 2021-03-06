import "@babel/polyfill";
import dotenv from "dotenv";
//import "isomorphic-fetch";
import "cross-fetch/polyfill";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import Koa from "koa";
//import next from "next";
import Router from "koa-router";
import session from "koa-session";
import proxy from "koa-proxy";
import mount from "koa-mount";
import serverless from "serverless-http";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
//const dev = process.env.NODE_ENV !== "production";
//const app = next({
//  dev,
//});
//const handle = app.getRequestHandler();
const {
  SHOPIFY_API_SECRET,
  REACT_APP_SHOPIFY_API_KEY,
  SCOPES,
  REACT_APP_SERVERLESS,
} = process.env;
//app.prepare().then(() => {
const backend = new Koa();
const frontend = new Koa();
const app = new Koa();
const router = new Router();
let backendPath;
if (REACT_APP_SERVERLESS) {
  backendPath = "/.netlify/functions/index";
} else {
  backendPath = "/api";
}

app.use(
  session(
    {
      sameSite: "none",
      secure: true,
    },
    app
  )
);
app.keys = [SHOPIFY_API_SECRET];
app.use(
  createShopifyAuth({
    prefix: backendPath,
    apiKey: REACT_APP_SHOPIFY_API_KEY,
    secret: SHOPIFY_API_SECRET,
    scopes: [SCOPES],

    async afterAuth(ctx) {
      // Access token and shop available in ctx.state.shopify
      const { shop } = ctx.state.shopify;
      console.log("Successfully authenticated.");

      // Redirect to app with shop parameter upon auth
      ctx.redirect(`/?shop=${shop}`);
    },
  })
);
backend.use(
  graphQLProxy({
    version: ApiVersion.October19,
  })
);

//router.get("(.*)", verifyRequest(), async (ctx) => {
//await handle(ctx.req, ctx.res);
//ctx.respond = false;
//ctx.res.statusCode = 200;
//});

router.get("/ping", async (ctx) => {
  ctx.body = "Pong!";
});

backend.use(router.allowedMethods());
backend.use(router.routes());
app.use(mount(backendPath, backend));

if (!process.env.REACT_APP_SERVERLESS) {
  frontend.use(
    proxy({
      host: "http://localhost:8081",
    })
  );
  app.use(mount("/", frontend));
  app.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}

const handler = serverless(app);
export default app;
export { handler };

//});
