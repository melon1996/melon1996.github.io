---
title: 手写洋葱模型
date: 2024-2-4 17:04:43
tags: js
---

# 洋葱模型Koa

Koa是一个用于构建web应用和api的轻量级、模块化的node.js框架，能帮助开发者利用async函数更好的错误处理和组织代码，koa的中间件机制采用了一种被称为洋葱模型的设计模式。

koa的洋葱模型是指中间件的执行方式，当中间件执行到一定程度，调用next，就会进入下一个中间件的执行，当下一个中间件执行完毕然后再回到上一个中间件执行next后的部分。

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

// 执行结果为：a-start  b-start  b-end  a-end


class Koa {
  constructor(){
    this.middlewares = [];
  }
  use(fn){
    this.middlewares.push(fn);
  }
  listen(port){
    http.on('request', ctx=>{
      this.compose(this.middlewares,ctx)
    })
  },
  compose(middlewares,ctx){
    next(0)
    const next = (index)=>{
      if(index===middlewares.length) return Promise.resolve()
      const fn = middlewares[index]
      return Promise.resolve(fn(ctx,()=>next(index+1)))
    }
  }
}
```