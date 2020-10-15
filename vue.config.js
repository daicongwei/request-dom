
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'https://api-hmugo-web.itheima.net/api/public/v1',
                changeOrigin: true,
                pathRewrite: { '^/api': '' }
            }
        }
    },
};