const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const BUILD_DIR = path.resolve(__dirname, '..', 'build');
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

const plugins = [
	new FileManagerPlugin({
		events: {
			onStart: {
				delete: [BUILD_DIR],
			},
		},
	}),
	new HtmlWebpackPlugin({
		template: path.join(PUBLIC_DIR, 'index.html'),
		filename: 'index.html',
	}),
	new webpack.HotModuleReplacementPlugin(),
];

if (process.env.SERVE) {
	plugins.push(new ReactRefreshWebpackPlugin());
}

const devServer = {
	historyApiFallback: true,
	open: true,
	compress: true,
	allowedHosts: 'all',
	hot: true,
	client: {
		overlay: {
			errors: true,
			warnings: true,
		},
		progress: true,
	},

	port: 3000,
	devMiddleware: {
		writeToDisk: true,
	},
	static: [
		{
			directory: path.join(BUILD_DIR, 'favicons'),
		},
	],
};

module.exports = {
	devServer,
	plugins,
	entry: path.join(__dirname, '..', 'src', 'index.tsx'),
	output: {
		path: BUILD_DIR,
		publicPath: '/',
	},
	performance: {
		hints: false,
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	module: {
		strictExportPresence: true,
		rules: [
			{
				test: /\.[jt]sx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
					},
				},
			},
			// --- HTML
			{ test: /\.(html)$/, use: ['html-loader'] },
			// --- SASS
			{
				test: /\.(s[ac]|c)ss$/i,
				exclude: /\.module\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader", // translates css into CommonJS
						options: {
							esModule: true,
						},
					},
					{
						// autoprefixer
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									[
										"postcss-preset-env",
										{
											// Options
										},
									],
								],
							},
						},
					},
				],
			},
			{
				test: /\.(s[ac]|c)ss$/i,
				include: /\.module\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader", // translates css into CommonJS
						options: {
							esModule: true,
							// css modules
							modules: {
								localIdentName: "[name]__[local]__[hash:base64:5]", // format of output
								namedExport: true, // named exports instead of default
							},
						},
					},
					{
						// autoprefixer
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									[
										"postcss-preset-env",
										{
											// Options
										},
									],
								],
							},
						},
					},
				],
			},
			// --- S/A/SS
			{
				test: /\.(s[ac])ss$/i,
				use: ["sass-loader"],
			},
			// --- IMG
			{
				test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/img/[hash][ext]',
				},
			},
			// --- FONTS
			{
				test: /\.(woff2?|eot|ttf|otf)$/i,
				exclude: /node_modules/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[hash][ext]',
				},
			},
		],
	},
};
