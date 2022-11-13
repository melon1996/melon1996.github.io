---
title: 浏览器缓存
date: 2022-11-13 15:40:18
tags: http
---


{% blockquote %}
内容参考:
[浏览器缓存](https://juejin.cn/post/6844903763665240072)
[彻底理解浏览器的缓存机制](https://juejin.cn/post/6844903593275817998) 
{% endblockquote %}

**浏览器缓存**是浏览器将用户请求过的静态资源存储到电脑本地磁盘中，当浏览器再次访问时，就可以直接从本地加载了，不需要再去请求服务器。

优点：
- 减少了冗余的数据传输
- 减少服务器负担，提升网站性能
- 加快客户端加载网页的速度

# 缓存流程

浏览器第一次请求资源时

![浏览器第一次请求资源](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b354e0a8cb2450aba81bc12e03d774e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

图中的缓存规则就是所请求的这个资源要采取哪种缓存策略？要缓存多长时间等等，而这个规则是在**响应头部（response headers）**返回回来的。

- 注意：请求头部也会携带规则信息，具体区别下面会讲。

# 缓存规则

强缓存和协商缓存

## 强缓存

强缓存意味着，如果资源没过期就取缓存，过期了就请求服务器。

那么如何判断缓存是否过期呢？也就是强缓存的规则怎么看？
主要是看响应头中的Cache-Control的值还有一个Expires（现在基本不用了）

![cache-control](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2fef124c55304637bbf89591ea947131~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

比如上图中Cache-Control设置了max-age=31XXXXXX，就是说在这些秒内都直接使用缓存，超过时间就请求服务器。

Cache-Control几个取值的含义：

1. private：仅浏览器可以缓存
2. public：浏览器和代理服务器都可以缓存（对于private和public，前端可以认为一样）
3. **max-age=XX**：过期时间
4. **no-cache**：不进行强缓存
5. no-store：不强缓存，与不协商缓存
注意：规则可以同时设置多条，比如：Cache-Control:public,max-age=0

所以，判断该资源是否命中强缓存，就看 response 中 Cache-Control 的值，如果有max-age=xxx秒，则命中强缓存。如果Cache-Control的值是no-cache，说明没命中强缓存，走协商缓存。

**强缓存流程**

1. 第一次请求 a.js ，缓存表中没该信息，直接请求后端服务器。
2. 后端服务器返回了 a.js ，且 http response header 中 cache-control 为 max-age=xxxx，所以是强缓存规则，存入缓存表中。
3. 第二次请求 a.js ，缓存表中是 max-age， 那么命中强缓存，然后判断是否过期，如果没过期，直接读缓存的a.js，如果过期了，则执行协商缓存的步骤了。

![第一次请求后，再次请求命中强缓存](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07f8dcf612474aa3b35ebea794f06fbe~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

![强缓存失效](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c27d01f81b746db9594013415232287~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

## 协商缓存

触发条件：
1. Cache-Control 的值为 no-cache （不强缓存）
2. max-age 过期了

协商缓存规则需要有两个标识，也在响应头部中返回：Etag和Last-Modified
Etag：每个文件有一个，文件改动了就会变化
Last-Modified：文件的修改时间

每次http返回回来的响应头部中的Etag和Last-Modified，在下次请求时需要在请求头部中带上，但是对应的名字变了：Etag -> If-None-Match ，Last-Modified -> If-Modified-Since ，服务器把请求中带过来的标识和目前的标识进行对比，然后判断资源是否更新了。

协商缓存流程如下：
1. 请求资源时，把用户本地该资源的 ETag 同时带到服务端，服务端和最新资源做对比。
2. 如果资源没更改，返回304，浏览器读取本地缓存。
3. 如果资源有更改，返回200，返回最新的资源。

![协商缓存未更新](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58e4541b60f44ff7ac7e9cf6c1242ba0~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

![协商缓存更新](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77ece84bcd294d22bdc966362248663e~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

## 缓存命中显示

1. 从服务器获取新的资源
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/402c62c9bc2d46d485c43abe6205a23f~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

2. 命中强缓存，且资源没过期，直接读取本地缓存
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27976c4bcca3415abaca5c85a862afe4~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

3. 命中协商缓存，且资源未更改，读取本地缓存
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a9096f25e1846dbac0d7203825ff9ff~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)

注意：协商缓存无论资源是否更改，都要向服务端发请求的，只不过，资源未更改时，返回的只是header信息，所以size很小；而资源有更改时，还要返回body数据，所以size会大。

### 内存缓存（memory cache）和硬盘缓存（disk cache）

浏览器的缓存是存放在内存或者硬盘中的，读取顺序为memory->disk

两者特点：
- 内存缓存：存进浏览器的内存中，具有快速读取和时效性（即一旦进程关闭，该进程的内存就会清空）；
- 硬盘缓存：写入硬盘文件中，读取缓存需要对该缓存存放的硬盘进行I/O操作，速度比内存缓存慢

因此，当关闭标签页再重新打开页面，缓存的页面资源会从硬盘中读取，而进行刷新操作时，js和图片资源等文件会直接从内存中读取，而css文件则会存入硬盘中

## 强缓存和协商缓存的区别

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a05986cd9044b878a4148252c46bcd0~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)


# 总结

强制缓存优先于协商缓存进行，若强制缓存(Expires和Cache-Control)生效则直接使用缓存，若不生效则进行协商缓存(Last-Modified / If-Modified-Since和Etag / If-None-Match)，协商缓存由服务器决定是否使用缓存，若协商缓存失效，那么代表该请求的缓存失效，重新获取请求结果，再存入浏览器缓存中；生效则返回304，继续使用缓存，主要过程如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/244a7d5cf07f421ba9d4e3dbb4a27bf4~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image)
