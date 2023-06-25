//jshint esversion:6npm i
require("dotenv").config();   //level 3 security   install dotenv and require it at the top
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
// const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//const secret = "Thisisourlittlesecret."   => move to .env file

// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

//Level 2 encryption. install mongoose-encrytion, require it , change ur schema if applicable ,
 // create ur const secret and userSchema.plugin(encrypt)

const User =new mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});


app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save()
    .then(function(){
        res.render("secrets");
    }).catch(function(err){
        res.send("err");
    });
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username})
    .then(function(foundUser){
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    }).catch(function(err){
        res.send("err");
    });

});




app.listen(3000,function(){
    console.log("Server started on port 3000.");
});