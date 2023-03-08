---
title: module
date: 2023-03-08 21:07:22
tags: es6
---

## 什么是模块化

把复杂代码按功能的不同划分成不同的模块单独维护，提高开发效率，降低维护成本。通常一个文件就是一个模块，有自己的作用域，只向外暴露特定的变量和函数。

## 模块化的标准

目前流行的js模块化规范有CommonJS、AMD、CMD以及ES6的模块系统

## ES Modules 和 CommonJS的一些区别

1. 使用语法层面，CommonJs是通过module.exports，exports导出，require导入；ESModule则是export导出，import导入
2. CommonJs是运行时加载模块，ESModule是在静态编译期间就确定模块的依赖
3. ESModule在编译期间会将所有import提升到顶部，CommonJs不会提升require
4. CommonJs导出的是一个值拷贝，会对加载结果进行缓存，一旦内部再修改这个值，则不会同步到外部。ESModule是导出的一个引用，内部修改可以同步到外部
5. CommonJs中顶层的this指向这个模块本身，而ESModule中顶层this指向undefined
6. CommonJS加载的是整个模块，将所有的接口全部加载进来，ESModule可以单独加载其中的某个接口
