/*
 * @Author: chen xin
 * @Date: 2022-02-23 21:42:05
 * @LastEditors: chen xin
 * @LastEditTime: 2022-07-10 17:03:15
 * @Description: file content
 * @FilePath: \melon1996.github.io\source\_code\router\history\demo.js
 */
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

let router = new HistoryRouter();
let container = document.getElementById('container');

//注册首页回调函数
router.registerIndex(() => container.innerHTML = '我是首页');

//注册其他视图回到函数
router.register('/page1', () => container.innerHTML = '我是page1');
router.register('/page2', () => container.innerHTML = '我是page2');
router.register('/page3', () => container.innerHTML = '我是page3');
router.register('/page4', () => {
    throw new Error('抛出一个异常')
});

document.getElementById('btn').onclick = () => router.assign('/page2')


//注册未找到对应path值时的回调
router.registerNotFound(() => container.innerHTML = '页面未找到');
//注册出现异常时的回调
router.registerError((e) => container.innerHTML = '页面异常，错误消息：<br>' + e.message);
//加载页面
router.load();
