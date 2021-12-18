'use strict';
const express = require('express');
var session = require('express-session');
const app = express();
const server = require('http').Server(app);
//Setup static page handling
app.set('view engine', 'ejs');
//set up session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use('/static', express.static('public'));
app.get('/', (req, res) => {
    res.render('template');
});
app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log("Username is: " + username + " and password is: " + password);
});

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