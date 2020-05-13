# 每周总结可以写在这里


## 作业

1.  JavaScript | 表达式，类型准换
    - 根据这节课上讲师已写好的部分，补充写完函数 convertStringToNumber
    - 以及函数 convertNumberToString
  
作业见 [convert.js](/week03/convert.js)
- 缺陷 `convertNumberToString`
  - 有些特大或者特长的数字无法转换出来，与存储的精度有关，不了解不知道怎么解决，如 1e39 在进行乘除10运算的时候可能变成 9.999999eN
  - 根据 ES 标准文档写的，然后没有达到完美预期效果，感觉既困难又没收获。
- `convertStringToNumber`
  - 本来想跟着文档写，可惜没能理解文档，只用了前半部分正则的匹配
  
2. JavaScript | 语句，对象
    - 根据课上老师的示范，找出 JavaScript 标准里所有的对象，分析有哪些对象是我们无法实现出来的，这些对象都有哪些特性？写一篇文章，放在学习总结里。

## JavaScript 标准中的对象

- JS 标准中的所有对象
```JavaScript
"Array,
ArrayBuffer,
ArrayBuffer.prototype,
Array.prototype,
Array.prototype.values,
Boolean,
Boolean.prototype,
DataView,
DataView.prototype,
Date,
Date.prototype,
decodeURI,
decodeURIComponent,
encodeURI,
encodeURIComponent,
Error,
Error.prototype,
eval,
EvalError,
EvalError.prototype,
Float32Array,
Float32Array.prototype,
Float64Array,
Float64Array.prototype,
Function,
Function.prototype,
Int8Array,
Int8Array.prototype,
Int16Array,
Int16Array.prototype,
Int32Array,
Int32Array.prototype,
isFinite,
isNaN,
JSON,
Map,
Map.prototype,
Math,
Number,
Number.prototype,
Object,
Object.prototype,
Object.prototype.toString,
parseFloat,
parseInt,
Promise,
Promise.prototype,
Proxy,
RangeError,
RangeError.prototype,
ReferenceError,
ReferenceError.prototype,
Reflect,
RegExp,
RegExp.prototype,
Set,
Set.prototype,
String,
String.prototype,
Symbol,
Symbol.prototype,
SyntaxError,
SyntaxError.prototype,
TypeError,
TypeError.prototype,
Uint8Array,
Uint8Array.prototype,
Uint8ClampedArray,
Uint8ClampedArray.prototype,
Uint16Array,
Uint16Array.prototype,
Uint32Array,
Uint32Array.prototype,
URIError,
URIError.prototype,
WeakMap,
WeakMap.prototype,
WeakSet,
WeakSet.prototype"
```
- 无法实现的对象或功能，太多了很多都没用过，只能挑自己知道的说了，后续待补充
    - Array 可以用直接量 [] 直接初始化
    - ArrayBuffer 直接操作二进制，开辟连续内存空间
    - Date 无法被继承
    - eval 执行语句，产生上下文的功能
    - Function 构造器指向自己，能够产生函数
    - Objet 具有把基本值包装成类的功能
    - Promise 知道与自己写的不一样，可能是性能更高
    - Error 系列，产生方式不容易实现
    - Symbol 单纯的符号，无意义却具有唯一标识性
    - WeeakMap / WeekSet 属性能跟随原变量动态变化。
  
### 本周收获

本周的收获不是很大，老师讲的课内容大多比较容易常见，自己也是从老师那里或者从文档那里获得了一些知识的罗列，目前还没有形成体系，点还没连成线，或者说线还是很简单，希望有一天能够得到突破。

从文档上来学习确实可以提供一种知识的完整性，不过追求完整性也不是适用任何情况，对于一些熟悉的内容“重学”，追求完整性是一个较好的方法，然而对一些不熟悉陌生的知识，不太适用。目前在工作设计中也会多考虑一些完整性，以达到系统的完备性。
