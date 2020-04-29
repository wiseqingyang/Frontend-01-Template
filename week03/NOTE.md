# 每周总结可以写在这里


- JavaScript | 表达式，类型准换
    - 根据这节课上讲师已写好的部分，补充写完函数 convertStringToNumber
    - 以及函数 convertNumberToString
  
作业见 [convert.js](/week03/convert.js)
- 缺陷
  - 有些特大或者特长的数字无法转换出来，与存储的精度有关，不了解不知道怎么解决，如 1e39 在进行乘除10运算的时候可能变成 9.999999e38
  - 根据 ES 标准文档写的，然后没有达到完美预期效果，感觉既困难又没收获。