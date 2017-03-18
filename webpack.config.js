
var webpack = require('webpack');

module.exports = {
	devtool: 'eval-sourve-map',
	entry: __dirname + '/src/app.js',
	output:{
		path: __dirname + '/build/',
		filename: 'bundle.js',
	},
 

	module:{
		loaders:[
			{
				test:/\.(json)$/,
				exclude:/node_modules/,
				loader:'json',
			},
			{
				 test: /\.jsx?$/,
				exclude:/node_modules/,
				loader:'babel-loader',
    			query: {
      				presets: ['react', 'es2015']
    			}


			},
			{
				test: /\.(?:png|jpg|gif)$/,
				loader:'url',
			},
			{
				test:/\.(?:css|scss)$/,
				loader:'style-loader!css-loader!sass-loader?localIdentName=[local]-[hash:base64:5]',
			},
		  	{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: "url-loader?limit=10000&mimetype=application/font-woff" 
			},
      		{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			}

		],
	},

	plugins:[
		
		new webpack.HotModuleReplacementPlugin(),
	],
	 

};