'use strict';

//testing json
var users = [{"email": "test1@test.com", "password": "test1"}];
var previews = [{
    "cvId": 1,
    "title": "CV 1",
    "jobTitle": "Software Engineer",
    "technicalSkills": ["Java", "C++"],
    "jobOffers": "Google"
}, {
    "cvId": 2,
    "title": "CV 2",
    "jobTitle": "Barista",
    "technicalSkills": ["Espresso", "Americano"],
    "jobOffers": "Tesla"
}];


var logged = false;
// a variable to save a session
var session;

//set up expres

const express = require('express');
const app = express();
const path = require("path");
const db = require('./db.js');
const FormData = require('form-data');
const fs = require('fs');
//const fileUpload = require('express-fileupload');
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage});
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// parse data with connect-multiparty.
// app.use(FormData.parse());
// // delete from the request all empty files (size == 0)
// app.use(FormData.format());
// // change the file objects to fs.ReadStream 
// app.use(FormData.stream());
// // union the body and the files
// app.use(FormData.union());


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
    cookie: {maxAge: oneDay},
    resave: false
}));
// cookie parser middleware
app.use(cookieParser());

// //add body-parser for client-server data transfer 
// const bodyParser = require('body-parser');
// const { json } = require('body-parser');
// const { connect } = require('http2');
// const { route } = require('express/lib/router');
// const { nextTick } = require('process');
// const { redirect } = require('express/lib/response');
// const res = require('express/lib/response');
// const { all } = require('express/lib/application');
// const { request } = require('express');
// const { isStringObject } = require('util/types');
// const req = require('express/lib/request');


//set up server
const server = require('http').Server(app);
//Setup static page handling
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static('public'));


const jobList = data();
app.locals.jobList = jobList;


//filetring function
app.post('/filter', (req, response) => {
    //user input 


    var jobTitle = req.body.jobTitle;
    console.log(req.body);
    if (!jobTitle.length) {
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
                response.render('home', {title: "Home", list: list});
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

app.get("/posts/:id", (req, response, next) => {
    var cvId = req.params.id;
    console.log(cvId);
    db.getCV(cvId).then((res) => {
        console.log(res);
        console.log(res.data.cvFile);

        var file = res.data.cvFile;
        if (typeof file === 'string' || file instanceof String) {

            fs.writeFileSync("public/cv.pdf", file, 'binary', (err) => {
                // throws an error, you could also catch it here
                if (err) throw err;

                // success case, the file was saved
                console.log('PDF saved!');
            });
        } else console.log("Invalid file");

        if (res.status == 400) {
            console.log(res.data);
            var msg = res.data;
            console.log(res.data);
            response.render('error', {title: "Error", message: msg});
        } else if (res.status == 200) {
            var cv = res.data;
            response.render('post', {title: "Post", cv: cv});
        } else {
            var msg = res.data;
            response.render('error', {title: "Error", message: msg});
        }

    });
    // for (let i = 0; i < previews.length; i++) {
    //     if (previews[i].id == cvId) {
    //         var name = previews[i].title;
    //         res.render('post', { title: name });
    //         next();
    //     }
    // }
    // res.render('error', { title: "Error", message: "Error 404: No post found" });

});

//full list of CVs
app.get('/', (req, res) => {
    session = req.session;
    if (session.userid) {
        logged = true;
    }


    if (req.body.list) {
        var list = req.body.list;
    } else {
        var list = previews;
    }
    res.render('home', {title: "Home", list: list});
});

app.get('/login', (req, res) => {
    res.render('login', {title: "Login"});
});

app.get('/register', (req, res) => {
    res.render('register', {title: "Register"});
});

app.get('/upload', (req, res) => {
    res.render('upload', {title: "Upload"});
});

//login form - process POST req
app.post('/auth', function (request, response) {
    var email = request.body.email;
    var password = request.body.password;
    db.login(email, password).then((res) => {
        console.log(res);
        if (res.status == 401 || res.status == 400) {
            console.log(res.data);
            var msg = res.data;
            response.render('login', {title: "Login", msg: msg});
        } else if (res.status == 200) {
            console.log(res.data);
            session = request.session;
            session.userid = res.data.userId;
            console.log(request.session);
            console.log("email is: " + email + " and password is: " + password);
            app.locals.userid = session.userid;
            app.locals.email = email;
            response.redirect('/');
        } else {
            var msg = "Unknown Error"
            response.render('login', {title: "Login", msg: msg});
        }

    });
});

function data() {

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


app.post('/register', function (request, response) {
    var email = request.body.email;
    var password = request.body.password;
    var firstName = request.body.firstName;
    var lastName = request.body.lastName;
    var education = request.body.education;
    var dateOfBirth = request.body.dateOfBirth;
    var address = request.body.address;
    var gender = request.body.gender;
    // var email = "raya3@mail.com";
    // var password = "Raya123@";
    // var firstName = "Raya";
    // var lastName = "Bakarska";
    // var education = "ECS";
    // var dateOfBirth = "2000-02-13";
    // var address = "UK";
    // var gender = "Female";

    console.log(request.body);
    db.register(email, password, firstName, lastName, dateOfBirth, education, address, gender).then((res) => {
        console.log(res);
        if (res.status == 400) {
            console.log(res.data);
            var msg = res.data;
            response.render('register', {title: "Register", msg: msg});
        } else if (res.status == 200) {
            session = request.session;
            session.userid = res.data.userId;
            console.log(request.session);
            console.log("email is: " + email + " and password is: " + password);
            app.locals.userid = session.userid;
            app.locals.email = email;
            response.redirect('/');
        } else {
            var msg = "Unknown Error"
            response.render('register', {title: "Register", msg: msg});
        }

    });
});


app.post('/upload', upload.single('cvFile'), function (request, response) {


    var userId = request.body.userId;

    var jobTitle = request.body.jobTitle;
    var jobOffers = request.body.jobOffers;
    var cvFile = request.file.buffer;
    console.log(cvFile);
    fs.writeFileSync("public/tmp.pdf", cvFile, 'binary', (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;

        // success case, the file was saved
        console.log('PDF saved!');
    });

    var data = new FormData();
    data.append('userId', userId);
    data.append('jobTitle', jobTitle);
    data.append('jobOffers', jobOffers);
    data.append('cvFile', fs.createReadStream(path.join(__dirname, 'public/tmp.pdf')));
    // fs.createReadStream(cvFile)
    console.log(data);
    db.upload(data).then((res) => {


        if (res.status == 400) {
            console.log(res.data);
            var msg = res.data;
            response.render('upload', {title: "Upload", msg: msg});
        } else if (res.status == 200) {
            console.log(res);
            response.redirect('/');
        } else {
            var msg = res.data;
            response.render('upload', {title: "Upload", msg: msg});
        }


    });

});


app.get('/user', (req, res) => {
    //TODO getUser function 
    var user = users[0];
    res.render('user', {title: "Profile", user: user});
});

app.get('/logout', (req, res) => {
    console.log(req.session);
    req.session.destroy();
    console.log(req.session);
    app.locals.userid = undefined;
    app.locals.email = undefined;

    res.redirect('/');
});


app.get('/about', (req, res) => {
    res.render('about', {title: "About"});
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