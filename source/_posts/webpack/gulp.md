---
title: 自动构建工具gulp
date: 2025-03-04 19:53:40
tags: webpack
---

官网：[https://www.gulpjs.com.cn/](https://www.gulpjs.com.cn/)

## 什么是gulp

Gulp 是一个基于Node.js的自动化构建工具，开发者可以使用它在项目开发过程中自动执行常见任务，例如压缩、合并文件，运行测试等。

- 主要特点：

  - 丰富优秀的插件生态系统
  - 易于学习和使用，每个插件都有对应的API，支持灵活的配置
  - 易于维护和扩展
  - 快速构建，基于流的构建方式

## Gulp和Webpack的区别

- Gulp是基于任务的自动化构建工具，通过定义一系列任务来实现构建流程，适合处理一些简单的任务，例如文件的压缩、合并、重命名等。
- Webpack是一个模块打包工具，通过定义入口文件，Webpack会自动分析模块之间的依赖关系，将模块打包成一个或多个文件。

## 概念

### Task

1. 任务（Task）：Gulp中的任务是一个函数，用于定义具体的构建任务，例如压缩文件、合并文件等。在Gulp中，任务是通过gulp.task()方法定义的:
  
  ```js
  // 入口文件
  gulp.task('task-name', () => {
   // 任务代码
  });
  ```

命令行中执行任务：

```shell
gulp task-name
```

2. 组合任务：可以通过gulp.series()和gulp.parallel()方法组合多个任务，实现任务的串行和并行执行。

  - gulp.series()：串行执行任务，一个任务执行完毕后再执行下一个任务。
  - gulp.parallel()：并行执行任务，多个任务同时执行。

  ```js
  // 串行执行任务
  gulp.task('task-name', gulp.series('task1', 'task2', 'task3'));

  // 并行执行任务
  gulp.task('task-name', gulp.parallel('task1', 'task2', 'task3'));
  ```

3. 默认任务：可以通过gulp.task()方法定义一个默认任务，当在命令行中执行gulp命令时，会执行默认任务。

  ```js
  // 默认任务
  gulp.task('default', () => {
   // 任务代码
  });
  ```

4. 异步任务：Gulp中的任务支持异步操作，可以通过返回一个Promise对象或者调用回调函数来实现异步任务。

  ```js
  // 异步任务
  gulp.task('task-name', (done) => {
   // 异步任务代码
   done();
  });
  ```

### Stream

1. 流（Stream）：Gulp中的流是一种数据传输方式，用于处理文件的输入和输出。Gulp中的任务通常是通过流来处理文件，例如读取文件、压缩文件、合并文件等。流程就是**输入/读取流**->**加工/转换流**->**输出/写入流**。

  ```js
  // 读取文件流
  gulp.src('src/*.js')
   .pipe(uglify())
   .pipe(gulp.dest('dist'));

  // 输出文件流
  gulp.src('src/*.js')
   .pipe(uglify())
   .pipe(gulp.dest('dist'));
  ```

### Globs

1. 通配符（Globs）：Gulp中的通配符用于匹配文件路径，可以使用通配符来匹配多个文件，例如`*.js`匹配所有的js文件，`**/*.js`匹配所有的js文件和子目录中的js文件。

  - `*`：匹配任意数量的字符，但不匹配路径分隔符（/）。
  - `**`：匹配任意数量的字符，包括路径分隔符（/）。
  - `?`：匹配单个字符，但不匹配路径分隔符（/）。
  - `!`：排除文件，匹配不符合条件的文件。

  ```js
  // 匹配所有的js文件
  gulp.src('src/*.js');

  // 匹配所有的js文件和子目录中的js文件
  gulp.src('src/**/*.js');

  // 排除所有的test.js文件
  gulp.src(['src/*.js', '!src/test.js']);
  ```

2. Glob base：Gulp中的glob base用于指定文件的基础路径，可以通过base选项来指定glob base。

  ```js
  // 指定glob base
  gulp.src('src/**/*.js', { base: 'src' });
  ```

### Plugins

1. 插件（Plugins）：Gulp中的插件是用于处理文件的函数，例如压缩文件、合并文件等。Gulp中有很多优秀的插件，可以通过npm安装，例如`gulp-uglify`用于压缩js文件，`gulp-concat`用于合并文件。每个插件只完成必要的工作，可以使用`pipe()`方法将多个插件串联起来并放在`src()`和`dest()`之间。

  ```js
  // 安装插件
  npm install gulp-uglify --save-dev
  npm install gulp-concat --save-dev

  // 使用插件
  const uglify = require('gulp-uglify');
  const concat = require('gulp-concat');
  ```

  ## 总结

  Gulp 可以帮助我们自动化构建项目流程，压缩合并文件，虽然现如今Webpack已经成为主流的构建工具，但Gulp依然有着自己的优势。在实际项目中，可以根据项目的需求选择合适的构建工具，或者结合使用Gulp和Webpack来实现更加灵活和高效的构建流程。