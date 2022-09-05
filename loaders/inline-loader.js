function loader(source) {
  console.log('inline-loader')
  return source;
}
module.exports = loader

// 光这么写，没有调不会执行，但是可以饮用这个其他文件（在a.js里饮用）
