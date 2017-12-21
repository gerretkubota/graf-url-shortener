// initializing express from dependencies
const express = require('express');
const app = express();

var shortenIt = require('./shortenIt.js');

var mainURL = 'https://graf-url-shortener.herokuapp.com';
//var refresh = require('./checkRefresh.js');
var isUrl = require('is-url');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// looks for the ejs files in the views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

// setting environment for local/heroku
app.set('port', (process.env.PORT || 3000));

// for mongodb
// const MongoClient = require('mongodb').MongoClient;


app.use(bodyParser.urlencoded({extended: true}));

// 'global' variable for database when connected to mongoDB
// var mongoURL ='mongodb://gerret:short123@ds161016.mlab.com:61016/shortlinks';

var mongoURL = process.env.MONGOLAB_URI;

var db;
var rand = 0;

mongoose.connect(mongoURL,
                    (err, database) => {
                      if(err)
                        return console.log(err);
                      db = database;
                      app.listen(app.get('port'), () => {
                        console.log('listening on ' + app.get('port'));
                      });
                    });
// make url model schema
var urlSchema = new mongoose.Schema({
  url: String,
  // hashNum: Number,
  id: Number,
  hashString: String,
  newURL: String
});
// makes collection of shortlinks
var ShortLinks = mongoose.model("shortlinks", urlSchema);

// function that checks if there the generated id already exists.
function checkDup(idValue){
  ShortLinks.findOne({"id" : idValue}, (err, origin) => {
    if(origin){
      // console.log(err);
      return true;
    }
    else{
      return false;
    }
  });
}

var sameLink = "";
var tempNewLink = "";

app.get('/', (req, res) => {
  // res.send('Harrooooooo');
  console.log(__dirname);
  res.render('index', {sameLink: sameLink, link: tempNewLink});
});


app.get('/:key', (req, res) => {
  var hashedID = req.params.key;
  ShortLinks.findOne({hashString: hashedID}, (err, stuff) => {
    if(stuff){
      res.redirect(stuff.url);
    }
    else{
      console.log(err);
      res.redirect(mainURL);
    }
  });
});


app.post('/generate', (req, res) => {
  var url = req.body.originURL;
  var hashString = '';
  var numberID = 0;

  console.log("generate spot: " + req.body.originURL);
  // generate a random number between 100 to 500 mill
  rand = Math.floor(Math.random() * 500000000) + 100;

  // keep looping until the rand doesn't exist
  while(checkDup(rand)){
    rand = Math.floor(Math.random() * 500000000) + 100;
  }

  ShortLinks.findOne({url: url}, (err, stuff) => {
    if(stuff){
      numberID = stuff.id;
      hashString = shortenIt.shorterURL.wrapIt(numberID);
      sameLink = url;
      tempNewLink = stuff.newURL;
      res.redirect('/');
      // res.render('index', {sameLink: url, link: stuff.newURL})
    }
    else{
      hashString = shortenIt.shorterURL.wrapIt(rand);

      var shortLink = new ShortLinks({
        url: url,
        id: rand,
        hashString: hashString,
        newURL: req.headers.origin + '/' + hashString
      });

      shortLink.save((err) =>{
        if(err){
          console.log(err);
        }
        // res.send('short url: ' + shortLink.newURL);
        sameLink = url;
        link = shortLink.newURL;
        // res.render('index', {sameLink: req.headers.origin, link: shortLink.newURL});
        res.redirect('/');
      });
    }
  });
});
