'use strict';

//testing json
var users = [{ "email": "test1@test.com", "password": "test1" }];
var previews = [{ "id": 1, "title": "CV 1", "jobTitle": "Software Engineer", "technicalSkills": ["Java", "C++"], "status": "interviews" }, {
    "id": 2,
    "title": "CV 2",
    "jobTitle": "Barista",
    "technicalSkills": ["Espresso", "Americano"],
    "status": "successful"
}];

const fs = require('fs')

const db = require('./db.js');
//session testing username and password
const myemail = users[0].email;
const mypassword = users[0].password;
var logged = false;
// a variable to save a session
var session;

//set up expres
const express = require('express');
const app = express();
const path = require("path");

//set up layouts - reusable 
const expressLayouts = require('express-ejs-layouts')
app.use(expressLayouts);
app.set('layout', './layouts/wrapper');

//set up express-session for cookies 
var session = require('express-session');
const cookieParser = require("cookie-parser");
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "secret",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
// cookie parser middleware
app.use(cookieParser());

//add body-parser for client-server data transfer 
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const { connect } = require('http2');
const { route } = require('express/lib/router');
const { nextTick } = require('process');
const { redirect } = require('express/lib/response');
const res = require('express/lib/response');
const { all } = require('express/lib/application');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//set up server
const server = require('http').Server(app);
//Setup static page handling
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static('public'));

//filetring function 
app.post('/filter', (req, response) => {
    //user input 


    var jobTitle = req.body.jobTitle;
    console.log(req.body);
    if (!jobTitle.length && !technicalSkills.length) {
        response.redirect('/');
    } else {
        db.filter(jobTitle).then((res) => {
            console.log(res);
            if (res.status == 400) {
                console.log(res.data);
                var msg = res.data;
                console.log(res.data);
                response.redirect('/');
            } else if (res.status == 200) {
                var list = res.data;
                response.render('home', { title: "Home", list: list });
            } else {

                response.redirect('/');
            }

        });
    }

    // var jobTitle = req.body.jobTitle;
    // var technicalSkills = req.body.technicalSkills;
    // console.log(technicalSkills.length);
    // if (!jobTitle.length && !technicalSkills.length) {
    //     res.redirect('/');

    // } else {

    //     var list = [];
    //     for (let i = 0; i < previews.length; i++) {
    //         var cv = previews[i];
    //         //if job matches the search 
    //         if (cv.job == job) {
    //             list.push(cv);
    //         }
    //         for (let j = 0; j < cv.technicalSkills.length; j++) {
    //             //if any of the sthrenghts matches the search 
    //             if (cv.technicalSkills[j] == technicalSkills) {
    //                 list.push(cv);
    //             }
    //         }
    //     }
    //     res.render('home', { title: "Home", list: list });
    // }
});

app.get("/posts/:id", (req, res, next) => {
    var cv_id = req.params.id;
    console.log(cv_id);
    for (let i = 0; i < previews.length; i++) {
        if (previews[i].id == cv_id) {
            var name = previews[i].title;
            res.render('post', { title: name });
            next();
        }
    }
    res.render('error', { title: "Error", message: "Error 404: No post found" });

});

//full list of CVs
app.get('/', (req, res) => {
    session = req.session;
    if (session.userid) {
        logged = true;
    }
    var jobList = data();
    console.log(jobList);
    app.locals.jobList = jobList;

    if (req.body.list) {
        var list = req.body.list;
    } else {
        var list = previews;
    }
    res.render('home', { title: "Home", list: list });
});

app.get('/login', (req, res) => {
    res.render('login', { title: "Login" });
});

app.get('/register', (req, res) => {
    res.render('register', { title: "Register" });
});

app.get('/upload', (req, res) => {
    res.render('upload', { title: "Upload" });
});

//login form - process POST req
app.post('/auth', function(request, response) {
    var email = request.body.email;
    var password = request.body.password;
    db.login(email, password).then((res) => {
        console.log(res);
        if (res.status == 401 || res.status == 400) {
            console.log(res.data);
            var msg = res.data;
            response.render('login', { title: "Login", msg: msg });
        } else if (res.status == 200) {

            session = request.session;
            session.userid = email;
            console.log(request.session);
            console.log("email is: " + email + " and password is: " + password);
            app.locals.userid = session.userid;
            response.redirect('/');
        } else {
            var msg = "Unknown Error"
            response.render('login', { title: "Login", msg: msg });
        }

    });
});

function data() {
    console.log("begin");
    var filename = path.join(__dirname, 'assets/Job_title.csv');
    var text = fs.readFileSync(filename, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return err

        } else {
            //console.log(data);
            return data;
        }
    });


    var record_num = 1; // or however many elements there are in each row
    var allTextLines = text.split(/\r\n|\n/);

    //var entries = allTextLines[0].split(',');


    var list = allTextLines;


    // console.log(headings);
    for (var i = 0; list.length <= 0; i++) {
        var tarr = [];
        for (var j = 0; j < record_num; j++) {
            tarr.push("title:" + list.shift());
        }
        list.push(tarr);
    }


    return list;
}





app.post('/register', function(request, response) {
    var email = request.body.email;
    var password = request.body.password;
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var education = request.body.education;
    var dateOfBirth = request.body.dateOfBirth;
    var address = request.body.address;
    var gender = request.body.gender;

    console.log(request.body);
    db.register(email, password, firstName, lastName, address, education, dateOfBirth, gender).then((res) => {
        console.log(res);
        if (res.status == 400) {
            console.log(res.data);
            var msg = res.data;
            response.render('register', { title: "Register", msg: msg });
        } else if (res.status == 200) {
            session = request.session;
            session.userid = email;
            console.log(request.session);
            console.log("email is: " + email + " and password is: " + password);
            app.locals.userid = session.userid;
            response.redirect('/');
        } else {
            var msg = "Unknown Error"
            response.render('register', { title: "Register", msg: msg });
        }

    });
});
app.post('/upload', function(request, response) {

    var userId = request.body.userId;
    var jobTitle = request.body.jobTitle;
    var jobOffers = request.body.jobOffers;
    var cvFile = request.body.cvFile;

    db.upload(userId, jobTitle, jobOffers, cvFile).then((res) => {
        console.log(res);
        if (res.status == 400) {
            console.log(res.data);
            var msg = res.data;
            response.render('upload', { title: "Upload", msg: msg });
        } else if (res.status == 200) {
            console.log(res);
            response.redirect('/');
        } else {
            var msg = "Unknown Error"
            response.render('upload', { title: "Upload", msg: msg });
        }

    });
    //     console.log(res);
    //     if (res["result"] == true) {
    //         session = request.session;
    //         session.userid = email;
    //         console.log(request.session);
    //         console.log("email is: " + email + " and password is: " + password);
    //         app.locals.userid = session.userid;
    //         response.redirect('/');

    //     } else if (res["result"] == false) {
    //         var msg = res["msg"];
    //         console.log(msg);
    //         response.render('register', { title: "Register", msg: msg });
    //     }
    // });
    // if (email == myemail && password == mypassword) {
    //     session = request.session;
    //     session.userid = email;
    //     console.log(request.session);
    //     console.log("email is: " + email + " and password is: " + password);
    //     app.locals.userid = session.userid;
    //     response.redirect('/');
    // } else {
    //     response.render('error', { title: "Error", message: "Invalid credentials" });
    // }


});


app.get('/user', (req, res) => {
    //TODO getUser function 
    var user = users[0];
    res.render('user', { title: "Profile", user: user });
});

app.get('/logout', (req, res) => {
    console.log(req.session);
    req.session.destroy();
    console.log(req.session);
    app.locals.userid = undefined;

    res.redirect('/');
});


app.get('/about', (req, res) => {
    res.render('about', { title: "About" });
});
//Start server
function startServer() {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

if (module === require.main) {
    startServer();
}

module.exports = server;