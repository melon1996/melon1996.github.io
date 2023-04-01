---
title: vue的响应式和数据双向绑定原理
date: 2023-04-01 21:48:14
tags: vue
---

# vue的响应式
vue的响应式是通过`Object.defineProperty()`方法（Vue2）或者`Proxy`方法（Vue3）实现的，通过`Object.defineProperty()`或`Proxy`劫持各个数据属性的setter和getter。当数据变动时会发布消息给订阅器，触发相应的监听事件渲染视图。

# 数据双向绑定
## 定义
数据双向绑定是VUE即MVVM框架的核心概念，简单地说就是数据的改变更新视图，视图的变化也会变动数据。![viewdata](images/mvvm/viewdata.png)
其中，View更新Data可以通过事件监听的方式实现，而Data更新View就是Vue数据双向绑定的核心，也是讨论的重点。

具体步骤：
1. 实现一个监听器`Observer`，用来劫持并监听所有属性，如果属性发生变化，就通知订阅者；
2. 实现一个订阅器`Dep`，用来收集订阅者，对监听器`Observer`和订阅器`Watcher`进行统一管理；
3. 实现一个订阅者`Watcher`，用来收到属性的变化通知并执行相应的方法，从而更新视图；
4. 实现一个解析器`Compile`，用来解析每个节点的指令，对模板数据和订阅器进行初始化；

![mvvm](images/mvvm/mvvm.png)
## 具体实现
模板：
```html

  <div id="app">
    <input type="text" v-model="text"> <br>
    {{ text }} <br>
    {{ text }}
</div>
```
javascript:

```javascript
	// 监听器
	function observe(obj, vm) {
        Object.keys(obj).forEach(function (key) {
            defineReactive(vm, key, obj[key]);
        });
    }
    function defineReactive(obj, key, val) {
        var dep = new Dep();
        // 响应式的数据绑定
        Object.defineProperty(obj, key, {
            get: function () {
                // 添加订阅者watcher到主题对象Dep
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set: function (newVal) {
                if (newVal === val) {
                    return; 
                } else {
                    val = newVal;
                    // 作为发布者发出通知
                    dep.notify()                        
                }
            }
        });
    }
    
	// 解析器
    function compile(node, vm) {
        var reg = /{{(.*)}}/;
        // 节点类型为元素
        if (node.nodeType === 1) {
            var attr = node.attributes;
            // 解析属性
            for (var i = 0; i < attr.length; i++) {
                if (attr[i].nodeName == 'v-model') {
                    var name = attr[i].nodeValue; // 获取v-model绑定的属性名
                    node.addEventListener('input', function (e) {
                        // 给相应的data属性赋值，进而触发属性的set方法
                        vm[name] = e.target.value;
                    })
                    node.value = vm[name]; // 将data的值赋值给该node
                    node.removeAttribute('v-model');
                }
            }
        }

        // 节点类型为text
        if (node.nodeType === 3) {
            if (reg.test(node.nodeValue)) {
                var name = RegExp.$1; // 获取匹配到的字符串
                name = name.trim();
                // node.nodeValue = vm[name]; // 将data的值赋值给该node

                new Watcher(vm, node, name);
            }
        }
    }
    
	// 订阅者
    function Watcher(vm, node, name) {
        Dep.target = this;
        this.name = name;
        this.node = node;
        this.vm = vm;
        this.update();
        Dep.target = null;
    }
    Watcher.prototype = {
        update: function () {
            this.get();
            this.node.nodeValue = this.value;
        },

        // 获取data中的属性值
        get: function () {
            this.value = this.vm[this.name]; // 触发相应属性的get
        }
    }
    
	// 订阅器
    function Dep () {
        this.subs = [];
    }
    Dep.prototype = {
        addSub: function (sub) {
            this.subs.push(sub);
        },
        notify: function () {
            this.subs.forEach(function (sub) {
                sub.update();
            });
        }
    }

    function nodeToFragment(node, vm) {
        var flag = document.createDocumentFragment();
        var child;

        while (child = node.firstChild) {
            compile(child, vm);
            flag.appendChild(child); // 将子节点劫持到文档片段中
        }
        
        return flag;
    }
    
    function Vue(options) {
        this.data = options.data;
        var data = this.data;

        observe(data, this);

        var id = options.el;
        var dom = nodeToFragment(document.getElementById(id), this);
        // 编译完成后，将dom返回到app中。
        document.getElementById(id).appendChild(dom);
    }

    var vm  = new Vue({
        el: 'app',
        data: {
            text: 'hello world'
        }
    });
```

> 参考文章：
>  https://juejin.cn/post/6844903903822086151
> https://juejin.cn/post/7142532417834713102#heading-3
