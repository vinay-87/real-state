var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var ejs = require("ejs");
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require("path");
const public = path.join(__dirname, "/public");
// const { JSDOM } = require('jsdom');

const app = express()
app.set("view engine","ejs");

app.set("views",public);
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://localhost:27017/EliteEstates')
var db = mongoose.connection
db.on('error', () => console.log("Error in Connecting to Database"))
db.once('open', () => console.log("Connected to Database"))


app.post("/signup", (req, res) => {
    var usr_name = req.body.username;
    var usr_pass = req.body.userpass;
    var usr_mail = req.body.usermail;
    console.log(usr_mail);
    // var usr_dob = req.body.usr_dob
    // var usr_email = req.body.usr_email

    var data = {
        "userName": usr_name,
        "password": usr_pass,
        "Email": usr_mail
        // "dob":usr_dob,
        // "email":usr_email
    }
    db.collection('UserInfo').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Succesfully")
    })
    return res.redirect('login.html')
})


app.post('/login', async (req, res) => {
    var email = req.body.usr_mail;
    var pass = req.body.usr_pass;
    // console.log(usr_name);
    // console.log(pass);
    try {
        const user = await db.collection('UserInfo').findOne({ password: pass, Email: email });

        if (user) {
            console.log("Access Given!");
            return res.render('home',{user:user});
        } else {
            console.log("Invalid Credentials!");
            return res.status(401).send("Invalid Credentials");
        }
         
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
});
app.post("/search",async(req,res)=>{
    return res.render('search.html');
});

app.get("/", (req, res) => {
    res.set({
        "Access-Control-Allow-Origin": '*'
    });

    // Assuming you have a user object retrieved from somewhere
    const user = { userName: "" };

    // Pass the user object to the template
    res.render('home', { user: user });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
