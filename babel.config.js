const plugins = [["@babel/plugin-proposal-decorators", { "version": "2023-05" }]];

module.exports = {
	presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'],
	plugins,
};
