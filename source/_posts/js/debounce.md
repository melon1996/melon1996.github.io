---
title: 节流与防抖
date: 2022-11-14 20:48:19
tags: js
---

# 节流

在指定时间间隔内，任务只会执行一次。

```javascript
  function throttle(fn,timeout){
    let flag = true
    return function(){
      if(!flag) return 
      flag = false
      setTimeout(()=>{
        fn.apply(this)
        flag = true
      },timeout)
    }
  }
```

# 防抖

在任务频繁触发的情况下， 只有任务触发的间隔超过指定时间，任务才会被执行。

```javascript
  let timer = null
  function debounce(fn,timeout){
    return function(){
      clearTimeout(timer)
      timer = setTimeout(()=>{
          fn.apply(this)
      },timeout)
    }
  }
```
