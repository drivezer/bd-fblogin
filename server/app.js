const express = require('express');
const path = require('path');
const body = require('body-parser');
//const app = express();
const mysql = require('mysql');

var fs = require('fs');
var http = require('http');
var https = require('https');
//var privateKey  = fs.readFileSync(path.resolve('server/key.pem', 'utf8'));
var privateKey  = fs.readFileSync('server.key', 'utf8');
var certificate = fs.readFileSync('server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const app = express();

var httpsServer = https.createServer(credentials, app);

app.use(body());
app.use(express.static(path.resolve(__dirname, '..', 'build')));

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'drive',
    password: '123456',
    database: 'bd_drive'
});
// show data
app.get('/data', function(req,res){
    console.log("Hello in /data ");
    let sql = 'SELECT * FROM users;';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        console.log(result);
        res.json(result);
    });
    console.log("after query");
});

//delete
app.put('/delete', function(req, res) {
    var sql = 'DELETE FROM users WHERE user_id = ?';
    db.query(sql,[req.body.user_id],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//edit
app.put('/data', function(req, res) {
    var sql = 'UPDATE users SET user_firstname = ? , user_lastname = ?, user_email = ?, user_phone = ? WHERE user_id = ?';
    db.query(sql,[
        req.body.user_firstname,
        req.body.user_lastname,
        req.body.user_email,
        req.body.user_phone,
        req.body.user_id
    ],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//insert
app.post('/data', function(req, res){
    console.log(req.body);
    let data = {
        // id:req.body.user_id,
        user_firstname: req.body.user_firstname,
        user_lastname: req.body.user_lastname,
        user_email: req.body.user_email,
        user_phone: req.body.user_phone
    };
    let sql = 'INSERT INTO users SET ?';
    db.query(sql, data, (err, result)=>{
        if(err){
            console.log(err);
            console.log("ID is Primarykey!!!!!");
            console.log("Enter the id again..");
        }else{
            console.log(result);
        }
    });
});


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});




//module.exports = app;
module.exports = httpsServer;
