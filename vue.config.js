const path = require('path');

module.exports = {
    runtimeCompiler: true,
    outputDir: path.resolve(__dirname, "./YouTooWeb"),
    publicPath: '/',
    chainWebpack: config => {
        config.resolve.alias
            .set('@', path.resolve(__dirname, './src'));
        config.module
            .rule("vue")
            .use("vue-svg-inline-loader")
            .loader("vue-svg-inline-loader")
            .options();
        config.plugins.delete('pwa');
        config.plugins.delete('workbox');
    },
    css: {
        loaderOptions: {
            scss: {
                prependData: `
		          @import "@/style/global/colors.scss";
		          @import "@/style/global/fonts.scss";
		          @import "@/style/global/respond.scss";
		          @import "@/style/global/variables.scss";
		          @import "@/style/global/tooltip.scss";
		          @import "@/style/global/dialog.scss";
		        `
            }
        }
    },
}
