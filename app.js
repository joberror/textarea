const express = require('express'),
  path = require('path'),
  app = express(),
  fs = require('fs'),
  sassMiddleware = require('node-sass-middleware'),
  minify = require('express-minify'),
  compression = require('compression'),
  assets = path.join(__dirname, "src/assets/");

// Set template engine
app.set('view engine', 'pug');
//Set directory of templates
app.set("views", path.join(__dirname, "src/views/"));

app.use(sassMiddleware({
  /* Options */
  src: path.join(assets, 'styles'),
  debug: true,
  outputStyle: 'compressed',
  prefix: '/styles' // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

// Set asset folder to `public` folder
app.use(compression());
app.use(minify());
app.use(express.static(assets));

// Listen on server
app.listen(4000, () => {
  console.log('Server listening on 4000');
});

app.get('/', (req, res) => {
  res.render('index', {});
});