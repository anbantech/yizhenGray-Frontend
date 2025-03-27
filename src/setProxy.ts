const proxySettings = {
  '/api/': {
    // target: 'http://188.188.188.88:7052',
    target: 'http://192.168.5.52:7005',
    changeOrigin: true
  },
  '/socket': {
    // target: 'http://188.188.188.88:7052',
    target: 'http://192.168.5.52:7005',
    // target: 'http://111.9.47.160:9031/socket',
    ws: true,
    changeOrigin: true,
    pathRewrite: {
      '^/socket': '/'
    }
  },
  '/sentry/': {
    target: 'http://router.anban.cloud:31005',
    ws: false,
    changeOrigin: true,
    pathRewrite: {
      '^/sentry': '/'
    }
  }
}

module.exports = proxySettings
