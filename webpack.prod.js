const merge = require('webpack-merge');
const common = require('./src/webpack.common.js');
module.exports = merge(common, {
    mode: 'production',
});