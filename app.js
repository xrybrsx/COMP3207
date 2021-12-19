'use strict';

//set up expres
const express = require('express');
const app = express();

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//set up server
const server = require('http').Server(app);
//Setup static page handling
app.set('view engine', 'ejs');
app.use('/static', express.static('public'));
app.get('/', (req, res) => {
    res.render('template', { title: "Welcome" });
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