'use strict';
var users = [{ "email": "1@test.com", "password": "test1" }];
var previews = [{ "id": 1, "title": "CV 1", "job": "Software Engineer", "strenghts": ["Java", "C++"] }, { "id": 2, "title": "CV 2", "job": "Barista", "strenghts": ["Espresso", "Americano"] }];


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
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//add body-parser for client-server data transfer 
const bodyParser = require('body-parser');
const { json } = require('body-parser');
const { connect } = require('http2');
const { route } = require('express/lib/router');
const { nextTick } = require('process');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//set up server
const server = require('http').Server(app);
//Setup static page handling
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static('public'));

//filetring function 
app.post('/filter', (req, res) => {
    //user input 
    var job = req.body.job;
    var strenghts = req.body.strenghts;
    console.log(strenghts.length);
    if (!job.length && !strenghts.length) {
        res.redirect('/');

    } else {

        var list = [];
        for (let i = 0; i < previews.length; i++) {
            var cv = previews[i];
            //if job matches the search 
            if (cv.job == job) {
                list.push(cv);
            }
            for (let j = 0; j < cv.strenghts.length; j++) {
                //if any of the sthrenghts matches the search 
                if (cv.strenghts[j] == strenghts) {
                    list.push(cv);
                }
            }
        }
        res.render('home', { title: "Home", list: list });
    }
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

//login form - process POST req
app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    request.session.username = username;
    response.redirect('/');
    console.log("Username is: " + username + " and password is: " + password);
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