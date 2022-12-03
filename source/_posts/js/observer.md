---
title: 观察者模式
date: 2022-12-03 21:37:53
tags: js
---

# JS设计模式之观察者模式

**观察者模式**：当对象之间存在一对多的依赖关系时，其中一个对象的状态发生改变，所有依赖他的对象都会收到通知，这就是观察者模式。

+ 目标对象：Subject
  + 维护观察者列表：observerList
  + 定义添加观察者的方法：addObserver
  + 当自身发生改变后，调用自己的notify方法通知每个观察者更新自身

+ 观察者：Observer
  + 实现更新自己的方法update

```javascript

  class Subject{
    constructor(){
      observerList=[]
    }
    addObserver(observer){
      this.observerList.push(observer)
    },
    notify(content){
      this.observerList(observer=>{
        observer.update(content)
      })
    }
  }

  class observer{
    constructor(name){
      this.name=name
    }
    update(content){
      console.log('update',content)
    }
  }
```