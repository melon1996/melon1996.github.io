---
title: 箭头函数
date: 2022-01-27 16:19:36
tags: js
---

## 使用

  1. 箭头函数没有自己的`this`对象;
  2. 不可以当作构造函数，也就是说，不可以对箭头函数使用`new`命令，否则会抛出一个错误。
  3. 不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用`rest`参数代替。
  4. 不可以使用`yield`命令，因此箭头函数不能用作`Generator`函数

  
  箭头函数的内部`this`指向是固定的，是定义时上层作用域中的`this`。

  ```js
    function foo() {
      setTimeout(() => {
        console.log('id:', this.id);
      }, 100);
    }
    var id = 21;
    foo.call({ id: 42 });
  ```
  上面代码中，`setTimeout()`的参数是一个箭头函数，这个箭头函数的定义生效是在`foo`函数生成时，而它的真正执行要等到`100` 毫秒后。

  箭头函数可以让`this`指向固定化，绑定`this`使得它不再可变，这种特性有利于封装回调函数。

  除了`this`，以下三个变量在箭头函数中也是不存在的，指向外层函数的对应变量：`arguments`,`super`,`new.target`。

  另外，由于箭头函数没有自己的`this`，所以也就不能用`call()`、`apply()`、`bind()`改变`this`的指向。

## 不适用场合

  1. 定义对象的方法，且该方法内部包括`this`。
    例如：

      ```js
      globalThis.s = 21;
      const obj = {
        s: 42,
        m: () => console.log(this.s)
      };
      obj.m() // 21
      ```
  2. 需要动态`this`的时候，也不应使用箭头函数，比如事件监听的回调函数。
