// initializing express from dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var shortenIt = require('./shortenIt.js');
var mainURL = 'https://graf-url-shortener.herokuapp.com';
//var refresh = require('./checkRefresh.js');
var isUrl = require('is-url');
var path = require('path');

// looks for the ejs files in the views directory
// app.set('view engine', 'ejs');
// app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));
// setting environment for local/heroku
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 'global' variable for database when connected to mongoDB
// mask db info
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
// store original url
// store the id generated
// store calculated hash
// store new generated url
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
      console.log(err);
      return false;
    }
  });
}

app.get('/', (req, res) => {
  // res.send('Harrooooooo');
  console.log(__dirname);
  // res.render('index', {sameLink: sameLink, link: tempNewLink});
  res.sendFile(path.join(__dirname, 'views/index.html'));
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
  var url = req.body.url;
  var hashString = '';
  var numberID = 0;
  var generatedURL = '';

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
      generatedURL = mainURL + '/' + shortenIt.shorterURL.wrapIt(stuff.id);
      res.send({'newURL': generatedURL});
      // res.render('index', {sameLink: url, link: stuff.newURL})
    }
    else{
      console.log("if it doesn't exist: " + rand + " ");
      hashString = shortenIt.shorterURL.wrapIt(rand);

      var shortLink = new ShortLinks({
        url: url,
        id: rand,
        hashString: hashString,
        newURL: mainURL + '/' + hashString
      });

      shortLink.save((err) =>{
        if(err){
          console.log(err);
        }

        generatedURL = mainURL + '/' + shortenIt.shorterURL.wrapIt(shortLink.id);
        res.send({'newURL': generatedURL});

      });
      // res.redirect('/');
    }
  });
});
