const express = require('express');
const app = express();
const server = require('http').Server(app);


app.get('/', (req, res) => {
    res.send('Hello, this is my home Page')
})

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