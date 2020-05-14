# 每周总结

## JavaScript 结构化程序设计

`JavaScript` 执行粒度从小到大可以分为

- 直接量/变量
- 表达式
- 语句/声明
- 函数调用
- 微任务
- 宏任务
- JS Context Realm

## Realm

 `Realm` 可以理解为领域的意思，在 `JS` 中视为，所有初始化属性的一个集合，不同的 `Realm` 之间可以通讯，但是之间不相同，比如用 `iframe` 新建一个window， 其中的 `Realm` 创建的 `Object` 和外层的 `JS` 环境创建的 `Object` 并不是一个类型，虽然看起来都一样。

 当涉及到类型转换，或隐式转换的时候，需要用到 `Realm`。

 ## 函数调用

 每个函数调用就会产生 `Execution Context` ，多个函数调用在一个 Execution Context Stack 中维护，Running Execution Context 指向正在运行中的 Execution Context。

 ### Execution Context

 Execution Context 中包含内容

 - code evaluation state
     - 代码执行位置
     - 主要是 async/await 和 generator 函数使用
 - Function
     - 当前执行的是否是函数
     - 可能是 null
 - Script Module
 - Generator
 - Realm
    - 标识自己在哪个 Real
 - LexicalEnvironment
    - this （新版的JS 放到了这里）
    - new.target
    - super
    - 变量
- VariableEnvironment
    - 历史遗留声明 主要处理 var 声明
    - 处理 with eval 等

## 浏览器原理

### 当我们在浏览器敲下回车会发生什么

- 根据 URL 发送 HTTP 请求，获取 HTML 代码
- 解析 HTML
- 产生 DOM 计算 CSS 属性
- 排版
- 渲染
- 产生位图

### OSI七层协议

我们通常使用的 HTTP 协议在上三层 , TCP 在传输层

TCP 是一种可靠流式传输，用端口做应用标识，采用双全工传输，对应 Node 中的 net 库

IP 中有包的概念，根据IP执行发送，一般只有 C++层能访问

HTTP 是 TCP 层之上的一种协议，一问一答，先问后答。


# 作业

1. 用 G6 antv 可视化 Realm 中的所有对象 [AntVG6.html](./AntVG6.html)

2. 根据老师课上讲解，完成课堂上的代码 [server.js](./server.js) [client.js](./client.js)
