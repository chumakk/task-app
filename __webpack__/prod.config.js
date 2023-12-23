const { merge } = require('webpack-merge');
const common = require('./common.config.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const plugins = [
	new MiniCssExtractPlugin({
		filename: '[contenthash].css',
	}),
];

module.exports = merge(common, {
	mode: 'production',
	target: 'browserslist',
	plugins,
	devtool: false,
	output: {
		filename: '[fullhash].js',
	},
	optimization: {
		usedExports: false,
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					mangle: false,
					compress: true,
					output: {
						beautify: true,
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},
});
