---
title: loader和plugin的区别
date: 2024-03-01 13:33:40
tags: webpack
---
# webpack的构建流程

参考：[webpack的构建流程](https://juejin.cn/post/7078683105799700488?searchId=20240222132211EBD7AC4936FCBC0FD14B)

## 总体运行流程

webpack的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：
- 初始化参数：从配置文件和`Shell`语句中读取与合并参数，并初始化需要使用的插件和配置插件等执行环境所需要的参数。
- 编译构建流程：从entry入口出发，针对每个module串行调用对应的loader去转换对应的文件内容，再根据module所依赖的module递归进行编译处理。
- 输出流程：将编译后的module组合成chunk，将chunk转换成文件，输出到文件系统中。

### 初始化参数

从配置文件和 `Shell` 语句中读取与合并参数，得出最终的参数，关于文件配置内容如下所示：

```javascript
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  entry:'./src/demo.js',
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack - cx",
      template: './src/index.html',
    }),
  ],
  module:{
    rules:[
      {
        test:/\.css$/,
        use:[
          'style-loader',
          'css-loader'
        ]
      },
      {
        test:/\.m?js$/,
        exclude:/(node_modules|bower_components)/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['es2015']
          }
        }
      }
    ]
  }
}
```
webpack将配置文件中的各个配置项拷贝到`options`对象中，并加载用户配置的`plugins`

完成上述步骤后，开始初始化`Compiler`对象，`Compiler`对象是webpack的核心对象，包含了webpack的所有配置信息，包括options、loaders、plugins等，该对象掌握了webpack生命周期，不执行具体任务，只是进行一些调度工作。

```javascript
class Compiler extends Tapable {
    constructor(context) {
        super();
        this.hooks = {
            beforeCompile: new AsyncSeriesHook(["params"]),
            compile: new SyncHook(["params"]),
            afterCompile: new AsyncSeriesHook(["compilation"]),
            make: new AsyncParallelHook(["compilation"]),
            entryOption: new SyncBailHook(["context", "entry"])
            // 定义了很多不同类型的钩子
        };
        // ...
    }
}

function webpack(options) {
  var compiler = new Compiler();
  ...// 检查options,若watch字段为true,则开启watch线程
  return compiler;
}
...
```

### 编译构建流程

根据配置中的`entry`找到入口文件
```javascript
module.exports = {
  entry: './src/file.js'
}
```
初始化完成后会调用`Compiler`的`run`来真正启动`webpack`编译构建流程，主要过程如下：
- compile 开始编译
- make 从入口点分析模块及其依赖的模块，创建模块对象
- buildModule 构建模块
- seal 封装构建结果
- emit 把各个chunk输出到结果文件

1. compile 开始编译

执行`run`方法，首先会触发`compile`，构建一个`compilation`对象，该对象包含了当前的模块资源、编译生成资源、变化的文件等。`compilation`对象也提供了很多插件可以调用的事件点，以供插件进行扩展。


2. 确定入口开始构建

完成构建了上述的`compilation`对象后就从配置文件（ `webpack.config.js` ）中指定的 `entry` 入口，开始读取，这里主要执行的是`_addModuleChain()函数`。

3. 构建编译模块

这里主要调用配置的`loaders`，将模块转换成标准的`js`模块

在用`Loader` 对一个模块转换完后，使用 `acorn` 解析转换后的内容，输出对应的`抽象语法树（AST）`，以方便 `Webpack` 后面对代码的分析

从配置的入口模块开始，分析其 `AST`，当遇到`require`等导入其它模块语句时，便将其加入到依赖的模块列表，同时对新找出的依赖模块递归分析，最终搞清所有模块的依赖关系

### 输出流程

4. seal 输出资源

`seal`方法主要是要生成chunks，对chunks进行一系列的优化操作，并生成要输出的代码

webpack 中的 `chunk` ，可以理解为配置在 `entry` 中的模块，或者是动态引入的模块

根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表


5. emit 输出完成

根据配置确定输出的路径和文件名，如下

```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
}
```

## 小结

![总体构建流程](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3fdf537128d462f8d8812643482c0d9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)