const express = require('express');
const path = require('path');
const cp = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();
const port =3000; 

app.use(cp());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'html')));

app.get('/', (req, res) => {
    res.redirect('/login')
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});
app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'registration.html'));
});
app.get('/homepage', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'homepage.html'));
});
app.get('/detail', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'details.html'));
});
app.get('/appointment', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'appoinment.html'));
});
app.get('/appointment-status', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'appointsucess.html'));
});
app.get('/Approval-Status', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'appstatus.html'));
});
app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
