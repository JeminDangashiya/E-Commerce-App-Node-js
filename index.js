var express = require('express');
var app = express();
const MongoClient = require('mongodb').MongoClient;
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

const connectionString = "mongodb+srv://jemin:_jemin$dangashiya_@cluster0.ct3jb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// connect node to mongodb
MongoClient.connect(connectionString, {
    useUnifiedTopology: true
}).then(client => {
    console.log('Connected to Database')
    const db = client.db('practice_app')

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
                pass: 'Dilip@123'
            }
        });

        var mailOptions = {
            from: senderEmail,
            to: decodeURIComponent(req.body.Email),
            subject: 'Sending Email using Node.js',
            html: 'Your otp is 987654, please reset your password <a href="http://localhost:8080/verifyOtp">here</a>'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                res.status(200).json({
                    success: false,
                    message: "Failed to Register user",
                    data: res.body,
                });
            } else {
                const users = db.collection('users_registration');
                users.insertOne({
                    ...req.body,
                    otp_code: '987654'
                }).then(result => {
                    res.send(result)
                })
                    .catch(error => console.error(error))
                res.status(200).json({
                    success: true,
                    message: "Registration successful",
                    data: res.body,
                });
            }
        });

    });


    app.post("/verifyOTPatLogin", urlencodedParser, (req, res) => {
        const users = db.collection('users_registration');
        users.find({
            Email: req.body.mail
        }).limit(1).toArray().then(res => {
            debugger
            if (res && res[0] && req.body.optCode == res[0].otp_code) {
                res.status(200).json({
                    success: true,
                    message: "Otp verified",
                    data: res.body,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Your otp is not valid",
                    data: res.body,
                });
            }
        }).catch(err => {

        })

    })




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
        const users = db.collection('users_registration');
        users.find({
            Email: req.body.mail,
            Password: req.body.password
        }).limit(1).toArray().then(result => {
            if (result && result[0]) {
                res.status(200).json({
                    success: true,
                    message: "Your are Logged in",
                    data: res.body,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "Your Account is not Verified",
                    data: res.body,
                });
            }
        })


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
    var senderEmail = "dilip.kakadiya.test@gmail.com"
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderEmail,
            pass: 'Dilip@123'
        }
    });

    var mailOptions = {
        from: senderEmail,
        to: decodeURIComponent(req.body.mail),
        subject: 'OTP for reset password',
        html: 'Your otp is 987654, please reset your password <a href="http://localhost:8080/verifyOtp">here</a>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.status(200).json({
                success: false,
                message: JSON.stringify(error),
                data: res.body,
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Email successfuly send",
                data: res.body,
            });
        }
    });
});

app.post("/verifyOtpCode", urlencodedParser, (req, res) => {
    const users = db.collection('users_registration');
    users.find({
        Email: req.body.mail
    }).limit(1).toArray().then(result => {
        if (result && result[0] && req.body.optCode == result[0].otp_code) {
            res.status(200).json({
                success: true,
                message: "Otp verified",
                data: res.body,
            });
        } else {
            res.status(200).json({
                success: false,
                message: "Your otp is not valid",
                data: res.body,
            });
        }
    }).catch(err => {
        res.status(200).json({
            success: false,
            message: "Your otp is not valid",
            data: res.body,
        });
    })
});




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
app.get('/verifyOtp', function (req, res) {
    res.render('verifyOtp');
})
app.get('/verifyOTPatLogin', function (req, res) {
    res.render('verifyOTPatLogin');
})
app.get('/resetpassword', function (req, res) {
    res.render('resetpassword');
})
app.get('/main-page', function (req, res) {
    res.render('main-page');
})





app.listen(8082);