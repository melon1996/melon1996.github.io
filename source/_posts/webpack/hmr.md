---
title: webpack的HMR原理
date: 2025-03-04 19:53:40
tags: webpack
---

HMR，全称Hot Module Replacement，模块热更新，能够在保持页面状态的情况下动态替换资源模块，提供流畅的页面开发体验。

## HMR的使用

1. 配置`devServer.hot`的属性为true，如：
```js
// webpack.config.js
module.exports = {
  // ...
  devServer: {
    // 必须设置 devServer.hot = true，启动 HMR 功能
    hot: true
  }
};
```

2. 调用`module.hot.accept`接口，声明如何将模块安全地替换为最新代码

## HMR实现原理

webpack的hmr核心流程如下：

1. 使用**webpack-dev-server**（*WDS*）托管静态资源，同时以Runtime方式注入HMR客户端代码
2. 浏览器加载页面后，与*WDS*建立websocket连接
3. webpack监听到文件变化后，增量构建发生变更的模块，并通过websocket发送hash事件
4. 浏览器接收到hash事件，请求manifest资源文件，确认增量变更范围
    - `manifest`文件：json格式，包含所有发生变更的模块列表，命名为`[hash].hot-update.json`
5. 浏览器加载发生变更的增量模块js文件
    - 模块变更文件：js格式包含编译后的模块代码，命名为`[hash].hot-update.js`
6. webpack运行时触发变更模块的module.hot.accept回调，执行代码变更逻辑
7. 完成

![alt text](/images/hmr/hmr.png)