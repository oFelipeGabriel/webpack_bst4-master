const path = require('path');
const webpack = require('webpack');
// const devMode = process.env.NODE_ENV !== 'production'; Node nv não é setado !!!

const prodMod = process.argv.indexOf('-p') !== -1; // MAS TE QUE RODAR COM `-p`

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

var glob_entries = require('webpack-glob-entries')

var HtmlWebpackPlugin = require('html-webpack-plugin');



function returnEntries(globPath){
   let entries = glob_entries(globPath, true);
   let folderList = new Array();
   for (let folder in entries){
      folderList.push(path.join(__dirname, entries[folder]));
   }
   return folderList;
}

configs = {

   cache: false,
   entry: {
      app:'./src/app.js',
    },
   output:{
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist')

   },
   stats:{
      timings: true,
      colors: true,
      entrypoints: true,
   },

   optimization:{ minimizer:[new OptimizeCSSAssetsPlugin({})]},

   module: {
      rules: [
         {
            test: /\.scss$/,
            include: path.resolve(__dirname, 'src/scss'),
            use: [
               // {
               //    loader: 'style-loader'
               // },
               MiniCssExtractPlugin.loader,
               {
                  loader: 'css-loader',
               },
               // {
               //    loader: 'postcss-loader', // Run post css actions
               //    options: {
               //       plugins: function () { // post css plugins, can be exported to postcss.config.js
               //          return [
               //             require('precss'),
               //             require('autoprefixer')
               //          ];
               //       }
               //    }
               // },
               'sass-loader'
            ]
         },
         {
            test: /\.html$|njk|nunjucks/,
            include: path.resolve(__dirname, 'src/templates'),
            use: [
               'html-loader',{
                  loader: 'nunjucks-html-loader',
                  options : {
                     searchPaths: [...returnEntries('./src/templates/**/')]

                  }
               }
            ]
         },
      // Loader for the image files
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000'
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath:  'fonts'
          }
        }]
      }
      ],
   },
   plugins: [
      new MiniCssExtractPlugin({
         filename: "[name].css",
         chunkFilename: "[id].css"
      }),
      new CleanWebpackPlugin(['dist']),
      new webpack.ProvidePlugin({
      $: 'jquery',
              jQuery: 'jquery',
              'window.jQuery': 'jquery',
              Tether: 'tether',
              'window.Tether': 'tether',
              Popper: ['popper.js', 'default']
          }),
   ],
};

if (prodMod) {
  configs.plugins.push(
    new UglifyJsPlugin({
      sourceMap: false,
      extractComments: true, //tira 2k do js !!
      parallel:true, // true = os.cpus().length - 1
    })
  );
};

var glob = require('glob');

let extPat = /\.[^/.]+$/; // regex para substituir a extesao do arquivo
let fromTos = [];  // referencia de arquivos njk->html  (from:, to:)
let njkPlugin = []; // lista de Nunjucked arquivos para o WebPack


function getNunJucksPlugged(njkFile, htmlFile){
   return(
      new HtmlWebpackPlugin({
         filename: htmlFile,
         inject: 'head',
         template: 'nunjucks-html-loader!'+ njkFile,
        })
   )
}


function addTemplates( files, ){
   files.forEach((file, index)=>{
      htmlFile = file.replace(extPat, ".html")
      htmlFile = htmlFile.split("/").pop();
      configs.plugins = configs.plugins.concat(getNunJucksPlugged(file, htmlFile));
   })
}

// Le arquivos TEMPLATES no path "./templates" e retornar lista com NOMES de
// arquivos njk->html
// só funciona porque é sincrono `glob.sync`.
files = glob.sync("./src/templates/**.njk",{"ignore":['**/node_modules/**','**/dist/**', '**/_*.*']});

addTemplates(files);

configs.plugins = configs.plugins.concat(njkPlugin);

module.exports = smp.wrap(configs);

