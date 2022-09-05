// 导入编译模块
let babel = require('@babel');
// 获取webpack.config.js的参数工具
let loaderUtils = require('loader-utils');
function loader(source) {
  console.log('loaderUtils:',loaderUtils);
  console.log(this.resourcePath);
  console.log(Object.keys(this));
  let options = loaderUtils.getOptions(this);
  let cb = this.async();
  babel.transform(source,{
    // 写法
    // presets:options.presets
    // 写法
    ...options,
    // 光在loader中开启sourceMap还不够，还需要在webpack.config.js配置
    sourceMap:true,
    // 定义文件名的
    filename: this.resourcePath.split('/').pop()
  }, function(err,result){
    cb(err,result.code,result.map)
  })
}
module.exports = loader
