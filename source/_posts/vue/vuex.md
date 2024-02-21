---
title: Vuex原理
date: 2024-02-21 19:49:17
tags: vue
---
# Vuex原理

参考：[手写vuex核心原理](https://juejin.cn/post/6855474001838342151?searchId=202402081503391D3D8D0FD083DA237AD2)

## 什么是Vuex

| 来自官方的解释 [vuex官网](https://vuex.vuejs.org/) |
| :--- |
| Vuex 是一个专门为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。 |

Vuex包含：状态(数据源)、视图、操作。是一种单向数据流理念，状态映射在视图上显现，视图上的操作改变状态。

Vuex的核心概念：state、getter、mutation、action、module。

**注意**
1. Vuex 的状态存储是响应式的
2. 改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation

## Vuex基本使用

main.js中引入Vue和store，将store注入到Vue实例中。

```javascript

import Vue from 'vue'
import store from './store/index '

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

```

store/index.js中引入Vue和Vuex，创建store实例并导出。

```javascript

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  getters:{
    doubleCount(state){
      return state.count*2
    }
  },
  mutations: {
    increment (state,payload) {
      state.count=payload
    }
  },
  actions: {
    increment (context,payload) {
      context.commit('increment',payload)
    }
  }
})

```

## 相关知识

### Vue.use介绍

vuex是通过插件注册的方式`Vue.use(Vuex)`引入到Vue中的，这里的`Vue.use`是Vue的一个全局API，用来注册插件。

`Vue.use(plugin,options)`

- plugin：插件，可以是一个对象或者函数，如果是一个对象，必须提供install方法，如果是一个函数，会被当做install方法。
- options：可选参数，传递给插件的参数

**注意**
1. 当插件被安装后，会在Vue的构造函数上挂载一个静态方法`Vue.prototype.$plugin`，可以通过`this.$plugin`在组件中使用插件的方法。
2. 插件必须在调用`new Vue()`之前被安装。
3. 一个插件只能被安装一次，重复安装会被忽略。

**简单实现**
  
```javascript

Vue.use = function(plugin){
  const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
  if(installedPlugins.indexOf(plugin)>-1){
    return this;
  }
  // 其他参数
  const args = toArray(arguments,1);
  args.unshift(this);
  if(typeof plugin.install === 'function'){
    plugin.install.apply(plugin,args);
  }else if(typeof plugin === 'function'){
    plugin.apply(null,plugin,args);
  }
  installedPlugins.push(plugin);
  return this;
}

```

### Vuex的本质

由于Vuex通过`Vue.use(Vuex)`引入到Vue中，所以Vuex的本质是一个插件。

1. Vuex是一个包含install方法的对象，install方法接收Vue作为参数。

2. Vuex中包含一个可以被实例化的Store类，Store类中包含了state、getter、mutation、action等方法。当Vue实例化时，会将store注入到Vue实例中。

因此我们可以知道Vuex的基本框架是这样的：

```javascript

class Store{}

const install = function(Vue){}

export default {
  Store,
  install
}

```

**install方法**

为什么所有的组件都能访问到store实例呢？

这是因为在install方法中，通过`Vue.mixin`方式将store实例混入到所有组件下，混入的时机为`beforeCreate`，这样所有的组件都能访问到store实例。

```javascript

let install = function(Vue){
    Vue.mixin({
        beforeCreate(){
            if (this.$options && this.$options.store){ // 如果是根组件
                this.$store = this.$options.store
            }else { //如果是子组件
                this.$store = this.$parent && this.$parent.$store
            }
        }
    })
}
```

## 手写Vuex

```javascript


// store类
class Store{
  constructor(options){
    this.vm = new Vue({
      data:{
        state:options.state
      }
    })
    // getters
    const getters = options.getters || {}
    this.getters = {}
    Object.keys(getters).forEach(getterName=>{
      Object.defineProperty(this.getters,getterName,{
        get:()=>{
          return getters[getterName](this.state)
        }
      })
    })
    // mutations
    const mutations = options.mutations || {}
    this.mutations = {}
    Object.keys(mutations).forEach(mutationName=>{
      this.mutations[mutationName] = (payload)=>{
        mutations[mutationName](this.state,payload)
      }
    })
    // actions
    const actions = options.actions || {}
    this.actions = {}
    Object.keys(actions).forEach(actionName=>{
      this.actions[actionName] = (payload)=>{
        actions[actionName](this,payload)
      }
    })
  }
  get state(){
    return this.vm.state
  }
  // commit方法
  // 使用箭头函数，保证调用dispatch时commit内的this指向当前store实例
  commit=(mutation, payload)=>{
    this.mutations[mutation](payload)
  }
  dispatch(action,payload){
    this.actions[action](payload)
  }
}
// install方法
const install = function(Vue) {
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) { // 根实例
        this.$store = this.$options.store
      } else {
        this.$store = this.$parent && this.$parent.$store //  子组件继承父组件的store
      }
    }
  })
}

export default {
  Store,
  install
}
```
