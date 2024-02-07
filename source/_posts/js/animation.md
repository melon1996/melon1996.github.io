---
title: js中实现动画
date: 2024-2-7 19:30:33
tags: js
---

# js中实现动画

在前端，实现页面动画有很多种方法，如：

- CSS3动画:transition、animation
- JS动画: setInterval、setTimeout、requestAnimationFrame
- html动画：canvas、svg


## requestAnimationFrame方法

Javascript 通过 requestAnimationFrame 方法来实现动画效果，这个方法是浏览器提供的一个内置的方法，用来实现动画效果。

### 语法

```javascript

var id = requestAnimationFrame(callback);

```

**参数**: callback 一个回调函数，这个函数会*在浏览器重绘之前调用*。这个函数会接收一个时间戳作为参数，这个时间戳是 requestAnimationFrame 开始执行的时间。

**返回值**: 返回一个整数，这个整数是一个唯一的标识符，可以将他传入 cancelAnimationFrame() 取消这个动画。

**取消动画**: 可以通过 cancelAnimationFrame(id) 方法来取消动画，参数id为当前执行的动画方法 requestAnimationFrame() 的返回值。

**注意**：

1. 如果想要动画循环执行，那么需要在回调函数中再次调用 requestAnimationFrame() 方法。

2. 回调函数的执行次数是60次/秒，和浏览器的屏幕刷新次数相匹配，也就是浏览器屏幕刷新多少次，回调函数就会执行多少次。

    *屏幕刷新次数：屏幕每秒出现图像的次数。普通笔记本为60Hz。*

3. 当有多个requestAnimationFrame()方法时，浏览器屏幕刷新一次，所有的回调函数都会执行一次并且他们的回调参数（时间戳）都是一样的。

4. 当浏览器窗口不可见即切换到其他标签页时，requestAnimationFrame()方法会暂停执行，当再次回到页面窗口才会重启，以提升性能。

5. 每执行一次requestAnimationFrame()方法，返回值就会 +1。

例如：

```javascript

  function test(timestamp) {
      console.log("requestAnimationFrame ----", timestamp);
      requestAnimationFrame(test);
  }
  requestAnimationFrame(test)

```


## 和 setInterval、setTimeout 对比

setInterval 和 setTimeout 方法是最早用来实现动画效果的方法，但是他们的问题在于**不够精准**。他们的执行机制决定了 时间间隔参数 只是将回调函数添加到**浏览器ui线程队列**中的时间，并不是回调执行的时间。当浏览器ui线程队列中有其他任务需要执行，那么回调函数就会等前面的任务执行完再执行。容易导致动画失帧，降低用户体验。这两种方法属于**EventLoop**层面的问题。

