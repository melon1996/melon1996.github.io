---
title: 发布订阅者模式
date: 2022-12-03 22:05:23
tags: js
---

# JS设计模式之发布订阅者模式

**发布订阅者模式**：基于一个事件（主题）通道，希望接收通知的对象Subscriber通过自定义事件订阅主题，被激活事件的对象Publisher通过发布主题事件的方式通知各个订阅该主题的Subscriber对象。

+ 任务发布者Publisher
+ 事件通道Event Channel
  + 维护任务类型，以及每个人物下的订阅情况
  + 给订阅者提供订阅功能——subscribe功能
  + 给所有订阅者发布任务——publish功能
+ 任务接收者Subscriber

```javascript

  class Pubsub{
    constructor(){
      this.event={}
    }
    subscribe(type,cb){
      if(!this.event[type]){
        this.event[type]=[]
      }
      this.event[type].push(cb)
    }
    publish(type){
      if(this.event[type]){
        this.event[type].forEach(cb=>{
          cb()
        })
      }
    }
    unsubscribe(type,cb){
      if(!this.event[type]) return
      if(!cb){
        delete this.event[type]
        return 
      }
      const index = this.event[type].findIndex(e=>e===cb)
      if(index>-1){
        this.event[type].splice(index,1)
      }
      if(!this.event[type].length){
        delete this.event[type]
      }
    }
  }

```