---
title: JSONP
date: 2024-02-21 19:55:27
tags: http
---
# JSONP

JSONP (JSON with Padding) 是json的一种使用模式。通过JSONP可以绕过浏览器的同源策略，从而实现跨域访问。

在进行AJAX请求时，由于同源策略的影响，无法进行跨域请求，而`<script>`标签的`src`属性是没有同源策略限制的，因此可以通过`<script>`标签来实现跨域请求，jsonp就是利用这个特性来实现的。在使用JSONP时，服务器端需要支持JSONP的请求，即返回一段调用某个函数的js代码，从而实现跨域。

**JSONP的优先在于兼容性好，但是缺点是只能进行get请求**

## 使用方法

1. 客户端定义一个回调函数，然后将函数名传递给服务器端
2. 服务器端接收到函数名后，将数据拼接到函数调用中，返回给客户端
3. 客户端接收到返回的js代码后，会立即执行该代码，从而实现跨域请求

服务端jsonp格式数据：

```javascript
var http = require("http")
var url = require("url")
 
http.createServer((req, res) => {
    var urlobj = url.parse(req.url, true)
    console.log(urlobj.query.callback);
    switch (urlobj.pathname) {
        case "/api/aaa":
            res.end(`${urlobj.query.callback} (${JSON.stringify({
                name: '张三',
                age: 21
            })})`)
            break;
        default:
            res.end("404")
    }
}).listen(3000, () => {
    console.log("start");
})
```

客户端实现callback函数：

```html
<!DOCTYPE html>
<html lang="en">
 
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
 
<body>
    <script>
        var oscript = document.createElement("script")
        oscript.src = "http://localhost:3000/api/aaa?callback=getJSONP"
        document.body.appendChild(oscript)
 
        function getJSONP(obj) {
            console.log(obj);
        }
    </script>
</body>
 
</html>
```