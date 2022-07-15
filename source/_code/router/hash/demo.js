/*
 * @Author: chen xin
 * @Date: 2022-02-23 21:41:53
 * @LastEditors: chen xin
 * @LastEditTime: 2022-07-09 23:46:18
 * @Description: file content
 * @FilePath: \melon1996.github.io\source\_code\router\hash\demo.js
 */
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

Router.route('/green', function() {
  changeBgColor('green');
});