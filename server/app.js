const express = require('express');
const path = require('path');
const body = require('body-parser');
//const app = express();
const mysql = require('mysql');

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(__dirname+'/server.key', 'utf8');
var certificate  = fs.readFileSync(__dirname+'/server.crt', 'utf8');
// var privateKey  = fs.readFileSync('/etc/letsencrypt/live/wassanadee.ddns.net/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/wassanadee.ddns.net/fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
const app = express();

var httpsServer = https.createServer(credentials, app);

app.use(body());
app.use(express.static(path.resolve(__dirname, '..', 'build')));

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'bd_drive'
});
// show data
app.get('/data', function(req,res){
    console.log("Hello in /data ");
    let sql = 'SELECT * FROM `users` JOIN `province` ON users.user_province_id = province.provinceId JOIN `district` ON users.user_district_id = district.districtId JOIN `subdistrict` ON users.user_sub_district_id = subdistrict.subdistrictId JOIN village ON users.user_village_id = village.villageId ORDER BY `users`.`user_id` ASC;';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show province
app.get('/provinces', function(req,res){
    let sql = 'SELECT * FROM `province`';
    db.query(sql, (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show district with province
app.get('/districts', function(req,res){
    let sql = 'SELECT * FROM `district` WHERE provinceId = ?';
    db.query(sql, [req.query.provinceId], (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show subdistrict with district
app.get('/subdistricts', function(req,res){
    let sql = 'SELECT * FROM `subdistrict` WHERE districtId = ?';
    db.query(sql, [req.query.districtId], (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

// show village with subdistrict
app.get('/villages', function(req,res){
    let sql = 'SELECT * FROM `village` WHERE subdistrictId = ?';
    db.query(sql, [req.query.subdistrictId], (err, result)=>{
        if(err) throw err;
        res.json(result);
    });
});

//delete
app.put('/delete', function(req, res) {
    var sql = 'DELETE FROM users WHERE user_id = ?';
    db.query(sql, [req.body.user_id],function (error, results) {
        if(error) throw error;
        res.send(JSON.stringify(results));
    });
});

//edit
app.put('/data', function(req, res) {
    var sql = 'UPDATE users SET user_firstname = ? , user_lastname = ?, user_email = ?, user_phone = ?, user_province_id = ?, user_district_id = ?, user_sub_district_id = ?, user_village_id = ? WHERE user_id = ?';
    db.query(sql,[
        req.body.user_firstname,
        req.body.user_lastname,
        req.body.user_email,
        req.body.user_phone,
        req.body.user_province_id,
        req.body.user_district_id,
        req.body.user_sub_district_id,
        req.body.user_village_id,
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
        user_phone: req.body.user_phone,
        user_created_by: req.body.user_created_by,
        user_province_id: req.body.user_province_id,
        user_district_id: req.body.user_district_id,
        user_sub_district_id: req.body.user_sub_district_id,
        user_village_id: req.body.user_village_id
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
