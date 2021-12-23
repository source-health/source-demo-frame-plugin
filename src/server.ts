import * as Koa from "koa";
import * as Router from "koa-router";
const app = new Koa();
var router = new Router();

router.post("/dialog", (ctx, next) => {
 let fullthis = {
    "fulfillmentText": "its cool man ye"
};
  ctx.body = fullthis
});

router.get("/", (ctx, next) => {
  ctx.body = { msg: "the whehe cool best" };
});

app.use(router.routes());

app.listen(3000);
