---
title: loader和plugin的区别
date: 2024-02-21 19:53:40
tags: webpack
---
# loaders和plugin的区别

参考[9个常见的 Webpack 面试题，中高级前端必会！](https://juejin.cn/post/7157998164627161095?searchId=2024021809420323E8E6CB6657782A2F16)

## 常见的loader

- sass-loader：将SCSS/SASS代码转换成CSS
- postcss-loader：扩展 CSS 语法，使用下一代 CSS，可以配合 autoprefixer 插件自动补齐 CSS3 前缀，加上兼容的浏览器厂商前缀
- css-loader：处理样式之间互相引用的逻辑, 加载 CSS，支持模块化、压缩、文件导入等特性
- style-loader：将 css-loader 解析后的内容挂载到 html 页面当中
- file-loader：可以指定要复制和放置资源文件的位置，以及使用版本哈希命名以获得更好的缓存，在代码中通过相对 URL 去引用输出的文件 (处理图片和字体)。
- url-loader：与 file-loader 类似，区别是用户可以设置一个阈值，大于阈值会交给 file-loader 处理，小于阈值时返回文件 base64 形式编码，减少HTTP请求
- image-loader：加载并且压缩图片文件
- source-map-loader：加载额外的 Source Map 文件，以方便断点调试
- json-loader 加载 JSON 文件（默认包含）
- babel-loader：把 ES6 转换成 ES5
- ts-loader: 将 TypeScript 转换成 JavaScript
- tslint-loader：通过 TSLint检查 TypeScript 代码
- eslint-loader：通过 ESLint 检查 JavaScript 代码
- mocha-loader：加载 Mocha 测试用例的代码
- coverjs-loader：计算测试的覆盖率
- vue-loader：将 Vue 组件转换为 JavaScript 模块
- i18n-loader: 国际化
- awesome-typescript-loader：将 TypeScript 转换成 JavaScript，性能优于 ts-loader
> loader的执行顺序是从右到左，从下到上的，即从下到上执行完后再从右到左执行完。 所以我们要用 `saas-loader` 来处理 sass 文件, 再把它交给 `postcss-loader` 加上浏览器厂商前缀。然后通过 `css-loader` 处理样式之间的引用逻辑。最后通过 `style-loader` 将它挂在到 html上

```javascript
module.export = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
```

## 常见的plugin
- html-webpack-plugin：在 dist 下生成 html 文件。简化 HTML 文件创建 (依赖于 html-loader)
- clean-webpack-plugin: 目录清理。把 dist 删除再生成打包结果
- copy-webpack-plugin 因为 public 文件下的资源是固定的，直接拷贝到编译后的文件夹引入使用就可以，例如 favicon.ico
- open-browser-webpack-plugin 启动webpack之后，自动打开浏览器
- mini-css-extract-plugin: 分离样式文件，CSS 提取为独立文件，支持按需加载
- webpack-parallel-uglify-plugin: 多进程执行代码压缩，提升构建速度
- HappyPack Plugin: 开启多进程打包，提升打包速度
- webpack-bundle-analyzer: 可视化 Webpack 输出文件的体积 (业务组件、依赖第三方模块)
- Dllplugin: 动态链接库，将项目中依赖的三方模块抽离出来，单独打包
- DllReferencePlugin: 配合 Dllplugin，通过 manifest.json 映射到相关的依赖上去
- vue-skeleton-webpack-plugin: vue 项目实现骨架屏

## loader和plugin的区别

1. 概念

loader是一个加载器，可以让webpack拥有解析和加载非JavaScript文件的能力。webpack本身只能解析JavaScript文件，如果想将其他文件也打包的话，就会用到loader，对其他类型的资源进行转译的预处理工作。**其本质是一个函数，对函数中接收到的内容进行转换，返回转换后的结果。**

plugin是一个插件，它的作用是增强webpack的功能，比如打包优化、资源管理、注入环境变量等。在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

2. 配置方式

loader在module.rules中配置，类型是数组，每一个对象就是一个loader。loader可以对文件类型进行匹配，然后进行相应的处理。

plugin在plugins中配置，类型是数组，每一项是一个plugin实例，参数通过构造函数传入。

3. 运行时机

loader在打包构建之前，文件从输入到输出的转换过程中起作用（在模块加载时预处理文件）。

plugin在整个构建过程中起作用，它的作用范围更广，可以监听webpack的生命周期的每个阶段。

## 手写一个loader

一个简单的`style-loader`:作用是将css样式通过`<style>`标签插入到html中

```javascript

module.exports = function (source) {
  const result = `
    const style = document.createElement('style');
    style.setAttribute("type", "text/css");
    style.innerHTML = ${source};
    document.head.appendChild(style);
  `;
  return result
}

```

## 手写一个plugin

plugin是一个类，它的原型上需要定义apply的方法，该方法接收一个compiler参数，通过compiler获取webpack内部的钩子，然后在对应的钩子上挂载一个回调函数。

```javascript
// 自定义一个名为MyPlugin插件，该插件在打包完成后，在控制台输出"打包已完成"
class MyPlugin {
  // 原型上需要定义apply 的方法
  apply(compiler) {
    // 通过compiler获取webpack内部的钩子
    compiler.hooks.done.tap("My Plugin", (compilation, cb) => {
      console.log("打包已完成");
      // 分为同步和异步的钩子，异步钩子必须执行对应的回调
      cb();
    });
  }
}
module.exports = MyPlugin;
```