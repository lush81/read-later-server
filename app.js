var express = require('express');
var app = express();
var read = require('node-readability');

var Firebase = require('firebase');
var fb = new Firebase("https://final-project-lush.firebaseio.com/");

var bodyParser = require('body-parser');
app.use(bodyParser());

var cors = require('cors');
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hello, World!')
})

app.get('/scraper', function(req, res) {
  var url = req.query.url;
  read(url, function(err, article, meta) { 
    if (article) {
      res.status(200).jsonp({
        url: url,
        title: article.title,
        content: article.content
      })
    } else {
      res.sendStatus(400)
    }
  })
});

app.post('/scraper', cors(), function (req, res) {
  var url = req.body.url;
  if (!url) {
      return res.sendStatus(400);
    } 
  read(url, function(err, article, meta) {
    if (article) {
        fb.child("articles").push({
        url: url,
        title: article.title,
        content: article.content,
        read: false
      });
      res.sendStatus(res.statusCode);
    } else {
      res.sendStatus(500);
    }
  });
});
module.exports = app;
