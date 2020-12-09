module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                // target:'http://192.168.37.8:6666',
                target:'http://localhost:6677',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}