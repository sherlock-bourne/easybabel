## 前言

本文为模拟简单版babel-loader来演示练习编写loader基本功项目。

此文档从个人本地笔记copy而出，未做精修处理，详细文档在本地。

占个坑，日后会出关于写loader的文章，可能会出几篇，定位从小白到实战，也可能只写要点总结，尚未想好。

## 创建项目

`pnpm init 或`

`npm init -y`

`pnpm install webpack  webpack-cli --save-dev`

新建src>index.js 随便输出内容

## 新建webpack.config.js

```js
let path = require('path')

module.exports = {
  // mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    // resolve是专门解析模块的
    path: path.resolve(__dirname,'dist')
  },
}
```

## 更改package.json：

```js
"scripts": {
    "build": "webpack"
  },
```

## npm run build

![image-20220902233130092](./images/image-20220902233130092.png)

提示配置模式，不设置将以**production**模式打包，暂时不需要压缩，故设置`mode: 'development'`

![image-20220902233505756](./images/image-20220902233505756.png)

再跑 打包成功

## 打开dist目录

![image-20220902233636585](./images/image-20220902233636585.png)

可以看到我们的main.js里面的代码是写到eval函数里面的

接下来我们做一个当打包时，把js文件里的输出的字符串改一下

新建loaders>replaceLoaders.js

```js
modules.exports = function(sources) {
  return sources.replace('dell','dellLee')
}
```

注意：不能写成箭头函数

## 那怎么去用这个loader？

### 配置module的rules

### loader如何接收webpack配置的参数呢？

```js
module : {
    rules: [
      {
        test: /\.js$/,
        // use写法一
        // use: [path.resolve(__dirname,'./loaders/replaceLoaders.js')]
        // use写法二
        use: [
          {
            loader: path.resolve(__dirname,'./loaders/replaceLoaders.js'),
            // 预设 
            options: {
              // 传给loader的参数
              name: 'lee',
              // presets: [
              //   '@babel/preset-env'
              // ]
          }
        }]
      }
    ]
```

通过this.query获取到options传递过来的参数

replaceLoaders.js

```js
module.exports = function(sources) {
  console.log(this.query);
  return sources.replace('dell',this.query.name)
}
```

![image-20220903001038303](./images/image-20220903001038303.png)

现在打包出的是

![image-20220903001320115](./images/image-20220903001320115.png)

所以：loader通过this.query接收webpack配置的options传递过来的参数

当然有时获取会出现错误，官方推荐使用loader-utils获取参数

### 使用loader-utils获取参数

![image-20220903003902643](./images/image-20220903003902643.png)

pnpm install loader-utils --save-dev

或npm i loader-utils -D

```js
const loaderUtils = require('loader-utils');
module.exports = function(source) {
  console.log(this.query);
  const options = loaderUtils.getOptions(this);
  return source.replace('dell',options.name)
}
```

启动，报错

![image-20220903031550132](./images/image-20220903031550132.png)

打印loaderUtils：

![image-20220903031700482](./images/image-20220903031700482.png)

没有getOptions方法，检查版本：

![image-20220903032909637](./images/image-20220903032909637.png)

getOptions这个方法是1.4.0版本的，而我们下的是最新3.2版本

pnpm uninstall loader-utils

npm i loader-utils@1.4.0

打印 有

![image-20220903033557183](./images/image-20220903033557183.png)

replaceLoaders.js

```js
const loaderUtils = require('loader-utils');
function loader(source) {
  // console.log(this.query);
  console.log(loaderUtils);
  const options = loaderUtils.getOptions(this);
  // return source.replace('dell',this.query.name)
  return source.replace('dell',options.name)
}
module.exports = loader
```

跑成功，可以看到配置的name参数成功转换源码里的'dell'。

![image-20220903034330482](./images/image-20220903034330482.png)



return的时候只有一个参数，但是我们有时需要sourceMap，或对源码进行处理，而需要把加工后的source和原本的source也传递出去，咋办？

## 把加工后的source和原本的source也传递出去

### 同步操作

[官网this.callback](https://webpack.docschina.org/api/loaders#thiscallback)

![image-20220903040310919](./images/image-20220903040310919.png)

```js
const loaderUtils = require('loader-utils');
function loader(source) {
  // console.log(this.query);
  console.log(loaderUtils);
  const options = loaderUtils.getOptions(this);
  // return source.replace('dell',this.query.name)
  const result = source.replace('dell',options.name)
  this.callback(
    null,
    result,
    source,
    meta
  );
}
module.exports = loader
```

这么写等价于return，跑起来后检验，终端和dist代码，和使用return时一样。

但仅限于同步操作，如果是异步操作，

```js
function loader(source) {
  const options = loaderUtils.getOptions(this);
  
  setTimeout(()=>{
    const result = source.replace('dell',options.name)
    return result
  },1000)
}
```

![image-20220903042654652](./images/image-20220903042654652.png)

就会报错：返回值要是buffer或string。

### 处理异步loader

[this.async](https://webpack.docschina.org/api/loaders/#thisasync)

![image-20220903042209641](./images/image-20220903042209641.png)

```js
function loader(source) {
  const options = loaderUtils.getOptions(this);
  const callback = this.async()
  
  setTimeout(()=>{
    const result = source.replace('dell',options.name)
    callback(null,result)
  },5000)
}
```

![image-20220903043235096](./images/image-20220903043235096.png)

处理成功

### 多个loader如何处理？

假如我们：先用异步loader把dell替换成'lee'，在用同步loader把'lee'替换成world，看看能不能最后处理成'hello world'

复制一份改名为：replaceLoadersAsync.js

原来的replaceLoaders.js代码改成：

```js
function loader(source) {
  return source.replace('lee','world')
}

module.exports = loader
```

在use里配置，但记住顺序**默认**是上到下，右到左，除非加配置项控制顺序，但不建议。

```js
rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve(__dirname,'./loaders/replaceLoaders.js')
          },
          {
            loader: path.resolve(__dirname,'./loaders/replaceLoadersAsync.js'),
            // 预设 
            options: {
              name: 'lee'
          }
        }]
      }
    ]
```

跑完后，看build文件结果，两个loader执行成功！

![image-20220903045631664](./images/image-20220903045631664.png)

再看看我们配置项，每次写地址都要写 “path.resolve(__dirname,'./xx.js')”很麻烦，能不能直接写地址？

可以的，使用resolveLoader

```js
// resolveLoader是专门解析Loader的
// 当use中用到了loader，就会去modules里找
resolveLoader:{
  // 找loader方式二：配置别名
  // alias: {
  //   loader1: path.resolve(__dirname,'loaders','loader1.js')
  // }
  // 找loader方式三：
  // 先‘node_modules’里找，找不到，再去下面的路径里找
  modules:['node_modules', './loaders']
},
module : {
  rules: [
    .
    .
    .
```



### 
