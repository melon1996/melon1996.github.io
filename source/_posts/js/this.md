---
title: call,apply,bind
date: 2022-11-17 11:07:05
tags: js
---

# 对this对象的理解

this 是执行上下文中的一个属性，它指向最后一次调用这个方法的对象。在实际开发中，this 的指向可以通过四种调用模式来判断。

+ **函数调用模式**，当一个函数不是一个对象的属性时，直接作为函数来调用时，this 指向全局对象
+ **方法调用模式**，如果一个函数作为一个对象的方法来调用时，this 指向这个对象
+ **构造器调用模式**，如果一个函数用 new 调用时，函数执行前会新创建一个对象，this 指向这个新创建的对象
+ **apply 、 call 和 bind 调用模式**，这三个方法都可以显示的指定调用函数的 this 指向。其中 apply 方法接收两个参数：一个是 this 绑定的对象，一个是参数数组。call 方法接收的参数，第一个是 this 绑定的对象，后面的其余参数是传入函数执行的参数。也就是说，在使用 call() 方法时，传递给函数的参数必须逐个列举出来。bind 方法通过传入一个对象，返回一个 this 绑定了传入对象的新函数。这个函数的 this 指向除了使用 new 时会被改变，其他情况下都不会改变

这四种方式，使用构造器调用模式的优先级最高，然后是 apply、call 和 bind 调用模式，然后是方法调用模式，然后是函数调用模式。

# 实现call，apply，bind函数

## call函数

1. 判断调用对象是否为函数
2. 判断传入的上下文对象是否存在，如果不存在则设置为window
3. 处理传入的参数，截取第一个参数之后的所有参数作为call函数除第一个入参外的其余参数
4. 将函数作为上下文对象的一个属性
5. 使用上下文对象调用这个方法，并保存返回结果
6. 删除刚才新增的属性
7. 返回结果

```javascript
  Function.prototype.myCall = function(context) {
    // 1. 判断调用对象
    if (typeof this !== "function") {
      throw new TypeError("Error");
    }
    // 2. 判断 context 是否传入，如果未传入则设置为 window
    context = context || window;
    // 3. 获取参数
    let args = [...arguments].slice(1),
      result = null;
    // 4. 将调用函数设为对象的方法
    context.fn = this;
    // 5. 调用函数并保存结果
    result = context.fn(...args);
    // 6. 将属性删除
    delete context.fn;
    // 7. 返回结果
    return result;
  };
```

## apply函数

实现步骤与call方法一致，区别在于对于参数的处理上

```javascript
  Function.prototype.myApply = function(context) {
    // 判断调用对象是否为函数
    if (typeof this !== "function") {
      throw new TypeError("Error");
    }
    let result = null;
    // 判断 context 是否存在，如果未传入则为 window
    context = context || window;
    // 将函数设为对象的方法
    context.fn = this;
    // 调用方法
    if (arguments[1]) {
      result = context.fn(...arguments[1]);
    } else {
      result = context.fn();
    }
    // 将属性删除
    delete context.fn;
    return result;
  };
```

## bind函数

**实现步骤**

1. 判断调用对象是否为函数
2. 保存当前函数的引用，获取其余传入的参数
3. 创建一个函数返回
4. 函数内部使用apply来绑定函数调用，需要判断函数作为构造函数的情况，此时需要传入当前函数的this给apply调用，其余情况都传入指定的上下文对象(?)

```javascript
  Function.prototype.myBind = function(context) {
    // 判断调用对象是否为函数
    if (typeof this !== "function") {
      throw new TypeError("Error");
    }
    // 获取参数
    let args = [...arguments].slice(1),
      _self = this;
    function bindFn() {
      // 根据调用方式，传入不同绑定值
      return _self.apply(
        this instanceof bindFn ? this : context,
        args.concat(...arguments)
      );
    };
    function Func(){}
    Func.prototype = _self.prototype
    bindFn.prototype = new Func()
    return bindFn
  };
```