'use strict';
var users = [{ "email": "1@test.com", "password": "test1" }];
var previews = [{ "id": 1, "title": "CV 1", "job": "Software Engineer", "strenghts": "Java, C++" }, { "id": 2, "title": "CV 2", "job": "Barista", "strenghts": "Espresso, Americano" }];


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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//set up server
const server = require('http').Server(app);
//Setup static page handling
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static('public'));


app.post('/filter', (req, res) => {
    var job = req.body.job;
    var strenghts = req.body.strenghts;
    console.log(job, strenghts);
    var list = [];
    console.log(previews);
    for (let i = 0; i < previews.length; i++) {
        if (previews[i].job == job || previews[i].strenghts == strenghts) {
            list.push(previews[i]);

        }
    }
    res.render('home', { title: "Home", list: list });
});

//full list of CVs
app.get('/', (req, res) => {
    var list = previews;
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