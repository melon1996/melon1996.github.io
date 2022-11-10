---
title: 事件循环
date: 2022-11-10 20:55:23
tags: js
---


## 1. 任务队列 ##

所有的任务可以分为同步任务和异步任务。

同步任务，顾名思义，就是立即执行的任务，同步任务一般会直接进入到主线程中执行；而异步任务，就是异步执行的任务，比如ajax网络请求，setTimeout 定时函数等都属于异步任务，异步任务会通过任务队列( Event Queue )的机制来进行协调。


同步和异步任务分别进入不同的执行环境，同步的进入主线程，即主执行栈，异步的进入 Event Queue 。主线程内的任务执行完毕为空，会去 Event Queue 读取对应的任务，推入主线程执行。 上述过程的不断重复就是我们说的 Event Loop (事件循环)。

下图描述了事件循环机制![task](https://imgconvert.csdnimg.cn/aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy82MTAwNTAyLTc4MzEzODliZWMzN2ZlNTIucG5n?x-oss-process=image/format,png)

## 2. 宏任务和微任务

JS中分为两种任务类型：**macrotask**和**microtask**，在ECMAScript中，microtask称为jobs，macrotask可称为task

### macrotask
又称之为宏任务，可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）；
每一个task会从头到尾将这个任务执行完毕，不会执行其它
浏览器为了能够使得JS内部task与DOM任务能够有序的执行，会在一个task执行结束后，在下一个 task 执行开始前，对页面进行重新渲染 （*task->渲染->task->*...）
### microtask
又称为微任务，可以理解是在当前 task 执行结束后立即执行的任务，也就是说，*在当前task任务后，下一个task之前，在渲染之前*；
所以它的响应速度相比setTimeout（setTimeout是task）会更快，因为无需等渲染，也就是说，**在某一个macrotask执行完后，就会将在它执行期间产生的所有microtask都执行完毕（在渲染前）**

(macro)task 主要包含：script( 整体代码)、setTimeout、setInterval、I/O、UI 交互事件、setImmediate(Node.js 环境);

microtask主要包含：Promise、MutaionObserver、process.nextTick(Node.js 环境)

在node环境下，process.nextTick的优先级高于Promise，也就是可以简单理解为：在宏任务结束后会先执行微任务队列中的nextTickQueue部分，然后才会执行微任务中的Promise部分。

**总结** 

 - 执行一个宏任务（栈中没有就从事件队列中获取）
 - 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
 - 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
 - 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）


## 3.执行栈

当我们执行一个方法时，JS会生成一个与这个方法对象的执行环境，又叫做执行上下文。
这个执行上下文中有这个方法的私有作用域、上次作用域的指向、方法的参数、私有作用域中定义的变量以及this对象。
这个执行环境会被添加到一个栈中，这个栈就是执行栈。

## 4. Vue的异步更新队列

Vue中DOM的更新是异步的，是在微任务中更新DOM。


{% blockquote https://v2.cn.vuejs.org/ %}

Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的`Promise.then`等。  

{% endblockquote %}

例如，当你设置 vm.someData = 'new value'，该组件不会立即重新渲染。当刷新队列时，组件会在下一个事件循环“tick”中更新。多数情况我们不需要关心这个过程，但是如果你想基于更新后的 DOM 状态来做点什么，这就可能会有些棘手。虽然 Vue.js 通常鼓励开发人员使用“数据驱动”的方式思考，避免直接接触 DOM，但是有时我们必须要这么做。为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用`Vue.nextTick(callback)`。这样回调函数将在 DOM 更新完成后被调用。  

也就是说，当我们想要改变vue中的某个数据的值时，vue不会立即重新渲染，数据不会立即发生改变，而是会在下一次事件循环的时候更新。这主要是因为*Vue中DOM的操作是异步的*

`nextTick()`的应用场景主要是：

 1. 在Vue生命周期的`created()`钩子函数进行的DOM操作一定要放在`Vue.nextTick()`的回调函数中
 2. 在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候，这个操作都应该放进`Vue.nextTick()`的回调函数中。
 
 # 5. 举例

![在这里插入图片描述](https://img-blog.csdnimg.cn/img_convert/e3ecf9294d3301ffe544eced8e1da767.png)

```javascript
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="item in list" :key="item.id" ref="list">{{ item.id }}</li>
    </ul>
    <button @click="addItem">添加</button>
  </div>
</template>

<script>
var list = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      list,
    };
  },
  methods: {
    addItem() {
      let length = this.list.length+1
      this.list.push({ id: length });
      console.log(this.$refs.list);
      this.$nextTick(()=>{
        console.log(this.$refs.list,'in nextTick')
      })
    },
  },
};
</script>
```
每次点击添加按钮会在列表中添加一条字段，从控制台中可以看到方法中打印的list和在nextTick中打印的list并不一样，这是因为**vue中的DOM是异步更新的**，为了最小化性能开销，所以一次事件中的所有数据变更，并不会同步的去更新 DOM，而是等待事件结束后，进行数据比对，计算出差异，然后一次性的变动 DOM。因此，两次 console.log 的结果不同。
事件中的 console.log 是同步执行的，在 list 数据中插入数据后，就进行了打印，但此时的事件并未结束，DOM 也尚未发生变动，因此打印结果依旧是原有的 li 数量。而 $nextTick 中的代码则是异步的、延迟调用的，待 DOM 变更结束后，去调用这一部分代码。