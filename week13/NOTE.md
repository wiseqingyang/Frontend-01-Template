# 每周总结可以写在这里

- 组件
  - 内部
    - state 来源用户输入
    - children
  - attribute
    - 描述属性
  - method
  - property
    - 强调从属
  - event
- attribute property
  - html
    - attribute 在html中用， property无法在html中用 js中都可以
    - attribute 与 property 大部分重合
      - class className classList
      - style
      - href a.href 与 a.getAttribute('href') 不同 单向映射
      - input 如果没有 property 结果是attribute 设置了 attribute 不变
- 如何设计组件状态
  - property
    - markup✖ js✔ jschange ✔ userinput ？
  - attribute
    - markup✔js✔jschange✔userinput？
  - state
    - markup✖js✖jschange✖userinput✔
  - config
    - markup✖js✔jschange✖userinput✖
  - lifecycle
  - children
    - content型
    - template型