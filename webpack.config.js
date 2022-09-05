let path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'build.js',
    // resolve是专门解析模块的
    path: path.resolve(__dirname,'dist')
  },
  // resolveLoader是专门解析Loader的
  // 当use中用到了loader，就会去modules里找
  resolveLoader:{
    // 找loader方式二：配置别名
    // alias: {
    //   loader1: path.resolve(__dirname,'loaders','loader1.js')
    // }
    // 找loader方式三：
    // 先‘node_modules’里找，找不到，再去下面的路径里找
    modules:['node_modules',path.resolve(__dirname,'loaders')]
  },
  // 表示需要源码演示 这样我们的babel-loader运行时才会通过sourcemap生成
  devtool:'source-map',
  module: {
    rules:[
      // {
      //   test:/\.js$/,
      //   // 正常情况下，找loader是找不到的
      //   // 找loader方式二
      //   // use:'loader1'
      //   // 找loader方式一：写路径
      //   // use: path.resolve(__dirname,'loaders','loader1.js')
      //   // 配完loader1之后，再来解析看看 
      //   // use:'loader1'
      //   // 上面是单个的，现在配置多个loader，数组写法
      //   use: ['loader3','loader2','loader1']
      // }
      // 对象写法
      // {
      //   test:/\.js$/,
      //   use: {
      //     loader:'loader3'
      //   }
      // },
      // {
      //   test:/\.js$/,
      //   use: {
      //     loader:'loader2'
      //   }
      // },
      // {
      //   test:/\.js$/,
      //   use: {
      //     loader:'loader1'
      //   }
      // }
      // // 对象写法
      {
        test:/\.js$/,
        use: {
          loader:'loader3'
        },
        enforce: 'pre'
      },
      {
        test:/\.js$/,
        use: {
          loader:'loader2'
        }
      },
      {
        test:/\.js$/,
        use: {
          loader:'loader1'
        },
        enforce: 'post'
      }
    ]

    // rules:[
    //   {
    //     test: /\js$/,
    //     use: {
    //       loader: 'babel-loader',
    //       // 预设
    //       options: {
    //         presets: [
    //           '@babel/preset-env'
    //         ]
    //       }
    //     }
    //   }
    //   // 自己的loader
    //   // {
    //   //   test: /\js$/,
    //   //   use:'banner-loader'
    //   // }
    // ]
  }
}





