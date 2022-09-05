// console.log("hello")
// // 直接导入写法
// // let str = require('./a.js')
// // 导入的时候 我们想给前面的inline-loader，怎么写？ 在前面要加上!号
// let str = require('!!inline-loader!./a.js') // 这就是我们所谓的行内loader 运行下看效果

class Hyx {
  constructor() {
    this.name = 'hyx'
  }
  getName() {
    return this.name
  }
}
let xh = new Hyx()
console.log(xh.getName());