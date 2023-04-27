module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://hn216.api.yesapi.cn', // 目标服务器地址
          changeOrigin: true, // 是否改变请求源地址
          pathRewrite: {
            '^/api': '/api' // 重写请求路径，将 /api 替换为空
          }
        }
      }
    }
  }