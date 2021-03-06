'use strict';

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var srcDir = './public/src';

var isProd= process.env.NODE_ENV === 'production' ? true : false;

function getEntry() {
    var jsPath = path.resolve(srcDir, 'js/entrys');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            //生产环境不加载hotloader
            //if(isProd){
            //    files[matchs[1]] = path.resolve(srcDir, 'js/entrys', item);
            //}else{
                files[matchs[1]] = [
                    "webpack-dev-server/client?http://127.0.0.1:3000",
                    "webpack/hot/only-dev-server",
                    path.resolve(srcDir, 'js/entrys', item)
                ];
            //}
        }
    });
    /*files['hotServer']= [
                "webpack-dev-server/client?http://127.0.0.1:3000",
                "webpack/hot/only-dev-server"];*/
    return files;
}

console.log(getEntry());

var commonsPlugin = new webpack
    .optimize
    .CommonsChunkPlugin('common.js');
var plugins =[];

if (isProd) {
    plugins.push(new webpack.DefinePlugin({__DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))}));
    plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}));
}
plugins.push(new webpack.HotModuleReplacementPlugin());
plugins.push(new webpack.NoErrorsPlugin());

module.exports = {
    //插件项 plugins: [commonsPlugin], 页面入口文件配置
    entry: getEntry(),
    //入口文件输出配置
    output: {
        //打包文件存放的绝对路径
        path: __dirname + '/public/dist/js/',
        //打包后的文件名
        filename: "[name].bundle.js",
        //publicPath:'/js/'
    },
    devServer:{
        inline:true
    },
    module: {
        //加载器配置
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'react-hot!babel-loader?cacheDirectory'
            }, {
                test: /\.scss$/,
                loader: 'style!css!sass?sourceMap'
            }, {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    /*externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'react-router': 'ReactRouter'd
    },*/
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: plugins
};