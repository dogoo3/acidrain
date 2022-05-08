const express = require("express");

const app = express();

app.use('/', express.static(__dirname + '/'));

app.get('', (req, res) => {
    res.sendFile(__dirname + "/putscore.html");
});

app.get('/game', (req, res) => {
    res.sendFile(__dirname + "/ingame.html");
});

app.get('/stand', (req, res) => {
    res.sendFile(__dirname + "/stand.html");
});

app.listen(7000);