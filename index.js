var express = require('express');
var app = express();
var es6Renderer = require('express-es6-template-engine')

// view engine setup
app.engine('html', es6Renderer);
app.set('views', 'components');
app.set('view engine', 'html');

// for using the static files in node js, register it with express
app.use(express.static(__dirname + '/public'));


app.listen(8080)