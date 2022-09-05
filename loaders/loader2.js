function loader(source) { // loader的参数 就是源代码
  console.log('loader2')
  return source;
}
loader.pitch =function() {
  console.log('loader2-pitch');
  return 'hyx'
}
module.exports = loader