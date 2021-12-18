'use strict';
const express = require('express');
const app = express();
const server = require('http').Server(app);
//Setup static page handling
app.set('view engine', 'ejs');
app.use('/static', express.static('public'));
app.get('/', (req, res) => {
    res.render('template');
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