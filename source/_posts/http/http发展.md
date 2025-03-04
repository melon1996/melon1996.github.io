# http发展-http/1到http/3

## 概念

http 是超文本传输协议（HyperText Transfer Protocol）的缩写，是用于从万维网服务器传输超文本到本地浏览器的传送协议。http 是基于 TCP/IP 协议的应用层协议。http/1.1 是目前使用最广泛的版本。

> http不断实现更多功能，到目前从http 0.9已经发展到http 3.0。

## http/0.9

被正式制定为标准是在1996年公布的HTTP/1.0协议，在此之前的协议都被称为HTTP/0.9。HTTP/0.9是一个非常简单的协议，只有一个命令GET：

```http
GET /index.html
```

没有HEADER等描述数据的信息，只能传递html文件，服务器发送完毕，就关闭TCP连接。

## http/1.0

1996年5月，HTTP/1.0被正式制定为标准。HTTP/1.0相对于0.9版本的协议，增加了很多功能：

- 增加了POST和HEAD方法
- 增加了状态行
- 在request中增加了HTTP的版本号
- 在request和response中增加了Header
- 添加[Content-Type]字段，支持传输html之外类型的文件
- 添加[Content-Encoding]字段，支持不同编码格式文件的传输，支持gzip、deflate、compress压缩格式
- 支持长连接

```http
 GET /index.html HTTP/1.0
 User-Agent: NCSA_Mosaic/2.0 (Windows 3.1)

 200 OK
 Date: Tue, 15 Nov 1994 08:12:31 GMT
 Server: CERN/3.0 libwww/2.17
 Content-Type: text/html；charset=utf-8 // 类型，编码。
 <HTML>
     A page with an image
     <IMG src="/image.gif">
 <HTML>
 ```

 **缺点**
 - 队头阻塞，每个TCP连接只能发送一个请求，数据发送完毕就会关闭连接。
 - 默认是短连接，即每个http请求都要使用TCP协议通过三次握手和四次挥手实现
 - 仅定义了16种状态码

## http/1.1

到目前为止，HTTP/1.1是最为广泛使用的版本。HTTP/1.1在1.0的基础上增加了一些新的特性：

- 持久连接（keep-live）：默认开启，一个TCP连接可以传输多个HTTP请求和响应。
- 管道机制：在持久连接的基础上，允许在前一个请求响应完全返回之前发送下一个请求，降低通信的延迟。
- chunked机制，分块响应。
- 引入缓存控制机制：强缓存和协商缓存，Cache-Control、Expires、Last-Modified、ETag等字段
- 引入了Host字段，支持多个域名共享一个IP地址
- 引入了PUT、DELETE、OPTIONS、TRACE、CONNECT等方法

**缺点**
- 队头阻塞问题依然存在
- 无状态性，巨大的http头部
- 无法支持服务器推送

## http/2.0

HTTP/2.0是HTTP/1.1的升级版本，主要的改进有：

- 二进制分帧：HTTP/2.0的数据传输是二进制格式，而不是文本格式，这样可以更方便的解析和处理。
- 多路复用：在一个TCP连接上可以并行的发送多个请求和响应，解决了队头阻塞问题。
- 头部压缩：HTTP/2.0使用HPACK算法对header的数据进行压缩，减少了数据传输量。
- 服务器推送：服务器可以主动推送资源给客户端，减少了客户端请求的次数。

![http2.0](images/http/http2.jpg)

**缺点**
- 由于http/2.0是基于TCP的，所以TCP的队头阻塞问题依然存在

## http/3.0 (HTTP-over-QUIC)

HTTP/3.0是基于QUIC协议的，QUIC是基于UDP的低时延的互联网传输层协议，解决了TCP的队头阻塞问题。