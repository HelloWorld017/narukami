const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cssLoaders = [
	{
		loader: 'css-loader',
		options: {
			importLoaders: 1
		}
	},
	'postcss-loader'
];

const cssExtract = ExtractTextPlugin.extract({
	use: cssLoaders,
	fallback: 'vue-style-loader'
});

const lessExtract = ExtractTextPlugin.extract({
	use: cssLoaders.concat('less-loader'),
	fallback: 'vue-style-loader'
});

module.exports = {
	entry: path.resolve(__dirname, 'src', 'index.js'),

	output: {
	  	path: path.resolve(__dirname, 'assets'),
		publicPath: '',
		filename: 'origami.bundle.js'
	},

	module: {
		rules: [
			{
				test:/\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						'less': lessExtract,
						'css': cssExtract,
						'js': 'babel-loader?presets[]=latest'
					}
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['latest']
				},
				exclude: /node_modules/
			},
			{
				test: /\.less$/,
				loader: lessExtract
			},
			{
				test: /\.css$/,
				loader: cssExtract
			},
			{
				test: /\.(png|jpg|gif|svg|ttf|woff|woff2|eot)$/,
				loader: 'file-loader',
				options: {
					name: 'files/[name].[ext]?[hash]'
				}
			}
		]
	},

	plugins: [
		new ExtractTextPlugin('origami.bundle.css')
	],
	devtool: '#eval-source-map'
};

if(process.env.NODE_ENV === 'production'){
	module.exports.devtool = '';
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	]);
}
