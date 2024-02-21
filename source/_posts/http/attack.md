---
title: 网络攻击
date: 2024-02-21 19:56:29
tags: http
---
# 网络攻击

前端常见的网络攻击有：XSS、CSRF、SQL注入、DNS劫持等。

## XSS

XSS（Cross Site Scripting）跨站脚本攻击，是一种代码注入攻击。攻击者在目标网站上注入恶意脚本，当用户访问该网站时，恶意脚本会被执行，从而达到攻击目的。
XSS分为存储型XSS和反射型XSS。
- 存储型XSS：攻击者提交含有恶意脚本的请求(通常使用`<script></script>`)，此脚本被保存在数据库中，当用户访问该网站时，恶意脚本会被执行。
    解决：对用户输入的内容进行过滤，对特殊字符进行转义。
- 反射型XSS：攻击者构造含有恶意脚本的URL，用户点击该URL后，恶意脚本会被执行，攻击者可以获取用户的cookie信息或密码等重要信息，进行恶性操作。
    解决：开启cookie的HttpOnly属性，禁止JavaScript脚本读取cookie信息。

## CSRF

CSRF（Cross Site Request Forgery）跨站请求伪造，是一种利用用户身份在目标网站上执行非预期操作的攻击。攻击者构造一个恶意网站，通过盗取cookie等用户信息访问该网站，从而在用户的浏览器中执行非预期操作。

解决：
1. 同源检测
可以通过`origin header`, `referer header`等字段来判断请求的来源是否合法。这种方法只可以防御第三方网站，不能防御同域下的CSRF攻击。
2. token验证
后端生成一个token，放在cookie中传给前端，每次请求时，前端将token放在请求头中，后端验证token是否合法。
3. cookie SameSite校验
SameSite是cookie的一个属性，可以设置为Strict、Lax、None。Strict表示同站请求才会携带cookie，Lax表示部分跨站请求也会携带cookie，None表示所有请求都会携带cookie。
当`SameSite=Lax`时，下面的跨站请求不会携带cookie：
    - script标签，jsonp将无法使用
    - img标签
    - iframe
    - POST请求

## SQL注入

攻击者在HTTP请求中注入恶意SQL命令，服务器用请求参数构造数据库SQL命令时，恶意SQL被执行。

## 网络劫持

### DNS劫持

攻击者劫持了 DNS 服务器，获得了修改 DNS 解析记录的权限，从而导致客户端请求的域名被解析到了错误的 IP 地址，攻击者通过这种方式窃取用户资料或破坏原有正常服务。

### http劫持

攻击者通过劫持用户的http请求，将用户的请求重定向到攻击者的服务器上，从而窃取用户的信息。