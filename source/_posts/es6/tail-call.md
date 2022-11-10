---
title: 函数尾调用
date: 2022-01-28 15:10:45
tags: ES6
---

## 什么是尾调用

  尾调用指的是某个函数的最后一步是调用另一个函数。如：
  ```js
    function f(x){
      return g(x)
    }
  ```
  以下三种情况都不属于尾调用
  ```js
    // 情况一
    function f(x){
      let y = g(x);
      return y;
    }

    // 情况二
    function f(x){
      return g(x) + 1;
    }

    // 情况三
    function f(x){
      g(x);  // 相当于return undefined
    }
  ```
## 尾调用优化

  >函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用帧上方，还会形成一个B的调用帧。等到B运行结束，将结果返回到A，B的调用帧才会消失。如果函数B内部还调用函数C，那就还有一个C的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”（call stack）

  尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了。

  尾调用优化就是：只保留内层函数的调用帧。大大节省了内存。

  <span style="color:red;font-weight:bold;">注意</span>：只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”。

## 限制

  ES6的尾调用优化只有在严格模式下开启，正常模式是无效的。
  这是因为在正常模式下，函数内部还有两个变量可以追踪调用栈：

  - `func.arguments`:返回调用时函数的参数；
  - `func.caller`:返回调用当前函数的那个函数。

  而在严格模式下，这两个变量被禁用，因此尾调用优化仅在严格模式下生效。

## 尾递归

  函数调用自身，称为递归。如果尾调用自身，就称为尾递归。

  尾递归的优点是：递归非常耗费内存，容易发生“栈溢出”。而对于尾递归来说，只存在一个调用帧，所以永远不会发生“栈溢出”。

  例如：阶乘函数：
  ```js
    function factorial(n) {
      if (n === 1) return 1;
      return n * factorial(n - 1);
    }
    factorial(5) // 120    
  ```
  改写成尾递归：
  ```js
    function factorial(n, total) {
      if (n === 1) return total;
      return factorial(n - 1, n * total);
    }
    factorial(5, 1) // 120
  ```

  #### 如何将递归函数改写成尾递归函数

  方法一：在尾递归函数之外，再提供一个正常形式的函数。

  比如阶乘函数还可以改写成：
  ```js
    function tailFactorial(n, total) {
      if (n === 1) return total;
      return tailFactorial(n - 1, n * total);
    }
    function factorial(n) {
      return tailFactorial(n, 1);
    }
    factorial(5) // 120
  ```

  也可以使用科里化函数：
  ```js
    function currying(fn, n) {
      return function (m) {
        return fn.call(this, m, n);
      };
    }
    function tailFactorial(n, total) {
      if (n === 1) return total;
      return tailFactorial(n - 1, n * total);
    }
    const factorial = currying(tailFactorial, 1);
    factorial(5) // 120
  ```

  方法二：采用ES6的函数默认值。
  ```js
    function factorial(n, total = 1) {
      if (n === 1) return total;
      return factorial(n - 1, n * total);
    }
    factorial(5) // 120
  ```

  #### 尾递归的实现

  由于尾递归优化只能在严格模式下生效，因此，想要在正常模式或者其他不支持该功能的环境下使用尾递归可以采用*循环*换掉*递归*的原理。

  一个正常的递归函数：
  ```js
    function sum(x, y) {
      if (y > 0) {
        return sum(x + 1, y - 1);
      } else {
        return x;
      }
    }
    sum(1, 100000)
    // Uncaught RangeError: Maximum call stack size exceeded(…)
  ```
  **蹦床函数**可以将递归执行转为循环执行：

  ```js
    function trampoline(f) {
      while (f && f instanceof Function) {
        f = f();
      }
      return f;
    }
  ```

  上面的递归求和函数可以写成：
  ```js
    function sum(x, y) {
      if (y > 0) {
        return sum.bind(null, x + 1, y - 1);
      } else {
        return x;
      }
    }
    trampoline(sum(1, 100000))
    // 100001
  ```
  **tco函数**才是尾递归优化的实现：
  ```js
    function tco(f) {
      var value;
      var active = false;
      var accumulated = [];

      return function accumulator() {
        accumulated.push(arguments);
        if (!active) {
          active = true;
          while (accumulated.length) {
            value = f.apply(this, accumulated.shift());
          }
          active = false;
          return value;
        }
      };
    }
    var sum = tco(function(x, y) {
      if (y > 0) {
        return sum(x + 1, y - 1)
      }
      else {
        return x
      }
    });
    sum(1, 100000)
    // 100001
  ```
