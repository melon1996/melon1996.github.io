---
title: 手写洋葱模型
date: 2022-11-20 17:04:43
tags: js
---

# 洋葱模型


```js
const app = new Koa();
app.use(async (ctx, next) => {
  console.log('a-start');
  await next();
  console.log('a-end');
});
app.use(async (ctx, next) => {
  console.log('b-start');
  await next();
  console.log('b-end');
});

app.listen(3000);


class Koa {
  constructor(){
    this.middlewares = [];
  }
  use(fn){
    this.middlewares.push(fn);
  }
  listen(port){
    http.on('request', ctx=>{
      callback(this,ctx)
    })
    const callback=function(instance,ctx){
      const next = function(index){
        if(index === instance.middlewares.length) return Promise.resolve();
        const fn = instance.middlewares[index];
        return Promise.resolve(fn(ctx, ()=>next(index+1)));
      }
      next(0)
    }

  }
}
```