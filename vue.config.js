module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
      }
    }
  },
  // 解决跨域问题
  // 原理：本地开启一个相同host的代理服务器，由代理服务器向资源服务器发送数据请求。
  // devServer: {
  //   // proxy: 'http://localhost:8888',
  //   proxy: { 
  //     '/api': {
  //       target: 'http://localhost:8888',
  //       // pathRewrite: {'^/api': ''}, // 重写路径
  //       changeOrigin: true, // 伪造请求头中的host值
  //     }
  //   }
  // }
}