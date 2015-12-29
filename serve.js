/**
 * Dependencies
 */
var metalsmith = require('metalsmith');

//var branch = require('metalsmith-branch');
var duo = require('metalsmith-duo');

// contents
var drafts = require('metalsmith-drafts');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');

// assets & files
var assets = require('metalsmith-assets');
var fingerprint = require('metalsmith-fingerprint');
var ignore = require('metalsmith-ignore');
var rename = require('metalsmith-rename');

// CSS
var sass = require('metalsmith-sass');
var autoprefixer = require('metalsmith-autoprefixer');
var postcss = require('metalsmith-postcss');
var customMedia = require('postcss-custom-media');
var customProperties = require('postcss-custom-properties');
var calc = require('postcss-calc');

var browserSync = require('metalsmith-browser-sync');


/**
 * Import metadata and config
 */
var metadata = require('./metadata');
var config = require('./package.json').config;

/**
 * Postcss plugins
 */
var postcss_plugins = [
    customMedia,
    customProperties,
    calc
];

/**
 * Autoprefixer settings
 */
var supported = {
    browsers: ['> 1%', 'last 2 versions', 'IE >= 9']
}

/**
 * Build
 */
metalsmith(__dirname)
    .source(config.contentRoot)
    .destination(config.devRoot)

    // Process metadata
    .metadata(metadata)

    // Process css
    .use(duo({ entry: ['css/index.css'] }))
    .use(sass({
        //outputDir: 'css/',          // This changes the output dir to "build/css/" instead of "build/scss/"
        sourceMap: true,
        sourceMapContents: true     // This will embed all the Sass contents in your source maps.
    }))
    .use(autoprefixer(supported))
    .use(postcss(postcss_plugins))
    .use(fingerprint({ pattern: ['css/index.css'] }))
    .use(ignore(['css/index.css']))

    // Process js
    .use(duo({ entry: ['js/index.js'] }))
    .use(fingerprint({ pattern: ['js/index.js'] }))
    .use(ignore(['js/index.js']))

    // Process templates and content
    .use(drafts())
    .use(markdown({
        smartypants: true,
        smartLists: true,
        gfm: true,
        tables: true
    }))

    // .use(permalinks())
    // .use(collections())
    // .use(pagination())

//    .use(branch('*.hbs')
    .use(layouts({
        engine: 'handlebars',
        directory: 'templates',
        partials: 'templates/partials'
    }))
//    )

    // .use(rename([
    //     [/\.hbs$/, '.html']
    // ]))

    .use(assets({
        source: './bower_components/bootstrap-sass/assets/fonts',       // relative to the working directory
        destination: './fonts'                                          // relative to the build directory
    }))
    .use(assets({
        source: './bower_components/font-awesome-sass/assets/fonts',    // relative to the working directory
        destination: './fonts'                                          // relative to the build directory
    }))

    // .use(minify())

    // Serve and watch for changes
    .use(browserSync({
        online: false,
        open: false,
        server: '.tmp',
        files: [ config.contentRoot + '/**/*.md', config.layoutRoot + '/**/*.hbs', config.styleRoot + '/**/*']
    }))

    // Build site
    .build(function(err) {
        if (err) throw err;
    });
