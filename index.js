var express = require('express');
var app = express();
var es6Renderer = require('express-es6-template-engine')
var bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});
app.use(urlencodedParser);

// view engine setup
app.engine('html', es6Renderer);
app.set('views', 'components');
app.set('view engine', 'html');

// for using the static files in node js, register it with express
app.use(express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.send('<a href="/Login">login</a><a href="/register">Register</a>');
})
app.get('/login', function (req, res) {
    res.render('login');
})



app.get('/login', function (req, res) {
    res.render('login');
})
app.get('/register', function (req, res) {
    res.render('register');
})

app.post("/registeruser", urlencodedParser, (req, res) => {
    if (!req.body.Name) {
        res.status(200).json({
            success: false,
            message: "Please enter proper name",
        });
        return
    }
    res.status(200).json({
        success: true,
        message: "Registration successful",
        data: res.body,
    });
});



app.listen(8080);