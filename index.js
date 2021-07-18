var express = require('express');
var app = express();
var es6Renderer = require('express-es6-template-engine')
var bodyParser = require("body-parser");
var nodemailer = require('nodemailer');
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
app.get('/forgetpassword', function (req, res) {
    res.render('forgetpassword');
})

app.post("/registeruser", urlencodedParser, (req, res) => {
    if (!req.body.Name) {
        res.status(200).json({
            success: false,
            message: "Please enter proper name",
        });
        return
    } else if (!req.body.Email) {
        res.status(200).json({
            success: false,
            message: "Please enter proper Email Address",
        });
        return
    } else if (!req.body.Password) {
        res.status(200).json({
            success: false,
            message: "Please enter Password",
        });
        return
    } else if (req.body.Password != req.body.ConfirmPassword) {
        res.status(200).json({
            success: false,
            message: "Please enter confirm Password",
        });
        return
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(decodeURIComponent(req.body.Email))) {
        res.status(200).json({
            success: false,
            message: "Please enter Proper email",
        });
        return
    }
    var senderEmail = "dilip.kakadiya.test@gmail.com"
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderEmail,
            pass: ''
        }
    });

    var mailOptions = {
        from: senderEmail,
        to: decodeURIComponent(req.body.Email),
        subject: 'Sending Email using Node.js',
        html: '<h1>Welcome</h1><p>That was easy!</p>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(200).json({
                success: false,
                message: "Failed to Register user",
                data: res.body,
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Registration successful",
                data: res.body,
            });
        }
    });
});

app.post("/loginuser", urlencodedParser, (req, res) => {
    if (!req.body.mail) {
        res.status(200).json({
            success: false,
            message: "Please enter proper Email Address",
        });
        return
    } else if (!req.body.password) {
        res.status(200).json({
            success: false,
            message: "Please enter Password",
        });
        return
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(decodeURIComponent(req.body.mail))) {
        res.status(200).json({
            success: false,
            message: "Please enter Proper email",
        });
        return
    }

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: res.body,
    });
});


app.post("/forgetpassword", urlencodedParser, (req, res) => {
    if (!req.body.mail) {
        res.status(200).json({
            success: false,
            message: "Please enter proper Email Address",
        });
        return
    } else if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(decodeURIComponent(req.body.mail))) {
        res.status(200).json({
            success: false,
            message: "Please enter Proper email",
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