---
title: 前端路由
date: 2022-07-10 21:22:05
categories: vue
---
## 前言

现在的前端项目大多是单页面应用，即SPA，其中路由是实现SPA的重要环节。

## SPA

SPA（Single Page Web Application）是单页面应用的简称，指的是打开一个web项目只有在第一次打开页面的时候才会向服务器请求资源，只有一个html文件，一旦页面加载完成，页面不会因为用户的操作而重载，切换页面时也不会再向服务器请求资源，而是通过js更改页面上的渲染内容，从而实现页面的跳转。

传统的多页面应用中每个页面就对应一个html文件，每次进行页面跳转都需要向服务器请求资源。

### 单页面应用与多页面应用


方面  |单页面应用|多页面应用
:------:|:-------:|:-------:
应用构成|一个html页面和多个片段|多个html页面  
页面跳转方式|利用js更新局部内容|请求html资源文件加载内容  
用户体验|首屏加载慢但切换快|首屏加载快但切换慢
页面传递数据|组件通信|URL,cookie,缓存
SEO效果|差|好

## 前端路由

由上文可知，单页面应用对SEO不友好，不方便搜索引擎进行收录，而且SPA无法记住用户的操作记录，无论刷新，前进还是后退都无法展示用户期待的内容。

前端路由于是应运而生，保证只有一个html页面时，在用户不刷新和跳转页面时，为每个视图都匹配一个特殊的url。在刷新，前进和后退时均通过这个url来实现。

为了实现这一点，需要做到：
1. 改变url的时候不让浏览器向服务器请求资源
2. 监听到url的变化

而**hash**和**history**模式就是为了实现上面的功能而诞生的。

### hash模式

url中#后面的变化是可以被监听到的，浏览器提供了原生监听事件hashChange()，它可以监听到如下变化：
1. 浏览器地址的变化
2. 浏览器的前进后退行为
3. 通过window.location方法改变浏览器地址

```javascript
class Routers {
  constructor() {
    this.routes = {};
    this.currentUrl = '';
    this.refresh = this.refresh.bind(this);
    window.addEventListener('load', this.refresh, false);
    window.addEventListener('hashchange', this.refresh, false);
  }

  route(path, callback=function() {}) {
    this.routes[path] = callback
  }


  refresh() {
    this.currentUrl = location.hash.slice(1)||'/';
    if(!this.routes.hasOwnProperty(this.currentUrl)){
      this.currentUrl = "/error"
    }
    this.routes[this.currentUrl]();
  }
}

window.Router = new Routers();

let content = document.querySelector('body');

function changeBgColor(color) {
  content.style.backgroundColor = color;
}

Router.route('/',function(){
  console.log("我是首页")
  changeBgColor('white')
})

Router.route('/error',function(){
  alert('该页面不存在')
})
Router.route('/yellow', function() {
  changeBgColor('yellow');
});

Router.route('/blue', function() {
  changeBgColor('blue');
});

```

### history模式

在h5出现之前就已经有history对象了，但早期的history对象只包含这几个方法：

```javascript
history.go(-1);       // 后退一页
history.go(2);        // 前进两页
history.forward();     // 前进一页
history.back();      // 后退一页
```

这几个方法都会触发history对象的原生事件popstate

在h5规范中，新增了以下几个api

```javascript
history.pushState();         // 添加新的状态到历史状态栈
history.replaceState();      // 用新的状态代替当前状态
history.state                // 返回当前状态对象
```

- history.pushState() 在保留现有历史记录的同时，将 url 加入到历史记录中
- history.replaceState() 会将历史记录中的当前页面历史替换为 url

对于history模式而言，改变url只能由下面几种方式引起：
1. 点击浏览器的前进后退
2. 点击a标签
3. 触发pushState
4. 触发replaceState

pushState和replaceState可以做到改变浏览器地址而不刷新页面，但调用这两个方法的时候并不会触发popstate事件，包括a标签的点击事件也不会被popstate监听到，因此上述的后三种方式都需要手动触发popstate的回调函数。

```javascript
class HistoryRouter{
    constructor(){
        //用于存储不同path值对应的回调函数
        this.routers = {};
        this.listenPopState();
        this.listenLink();
    }
    //监听popstate
    listenPopState(){
        window.addEventListener('popstate',(e)=>{
            let state = e.state || {},
                path = state.path || '';
            this.dealPathHandler(path)
        },false)
    }
    //全局监听A链接
    listenLink(){
        window.addEventListener('click',(e)=>{
            let dom = e.target;
            if(dom.tagName.toUpperCase() === 'A' && dom.getAttribute('href')){
                e.preventDefault()
                this.assign(dom.getAttribute('href'));
            }
        },false)
    }
    //用于首次进入页面时调用
    load(){
        let path = location.pathname;
        this.dealPathHandler(path)
    }
    //用于注册每个视图
    register(path,callback = function(){}){
        this.routers[path] = callback;
    }
    //用于注册首页
    registerIndex(callback = function(){}){
        this.routers['/'] = callback;
    }
    //用于处理视图未找到的情况
    registerNotFound(callback = function(){}){
        this.routers['404'] = callback;
    }
    //用于处理异常情况
    registerError(callback = function(){}){
        this.routers['error'] = callback;
    }
    //跳转到path
    assign(path){
        history.pushState({path},null,path);
        this.dealPathHandler(path)
    }
    //替换为path
    replace(path){
        history.replaceState({path},null,path);
        this.dealPathHandler(path)
    }
    //通用处理 path 调用回调函数
    dealPathHandler(path){
        let handler;
        //没有对应path
        if(!this.routers.hasOwnProperty(path)){
            handler = this.routers['404'] || function(){};
        }
        //有对应path
        else{
            handler = this.routers[path];
        }
        try{
            handler.call(this)
        }catch(e){
            console.error(e);
            (this.routers['error'] || function(){}).call(this,e);
        }
    }
}
```

> 需要注意的是history 在修改 url 后，虽然页面并不会刷新，但我们在手动刷新，或通过 url 直接进入应用的时候，服务端是无法识别这个 url 的。因为我们是单页应用，只有一个 html 文件，服务端在处理其他路径的 url 的时候，就会出现404的情况。所以，如果要应用 history 模式，需要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回单页应用的 html 文件。

## 总结

前端路由的原理其实就是hash和history这两种模式

- hash模式
1. hash可以改变url但不会刷新页面，所有页面的跳转都是在浏览器端完成，无需http请求，因此也不利于SEO优化。
2. hash通过hashChange方法跳转。
3. hash是纯前端的操作。

- history模式
1. 新的url可以与当前url一样的地址，会把重复的操作记录到栈里。
2. 通过history.state可以将任意类型的数据添加到记录里。
3. 可以额外设置title属性。
4. 通过pushState，replaceState实现无刷新跳转页面。
5. 对当前页面进行刷新时，会重新发起请求，如果nginx没有匹配对应的url就会出现404，因此需要设置服务端来允许地址可访问。



