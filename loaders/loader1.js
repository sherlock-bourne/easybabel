let loaderUtils = require('loader-utils');
function loader(source) { // loader的参数 就是源代码
  console.log('loaderUtils:',loaderUtils);
  console.log('loader1')
  return source;
}
loader.pitch =function() {
  console.log('loader1-pitch');
}
module.exports = loader