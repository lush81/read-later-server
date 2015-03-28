var express = require('express');
var app = express();
var Firebase = require('firebase');
require('jquery');
var http = require('http');
var myDataRef = new Firebase('https://final-project-lush.firebaseio.com/');
var read = require('node-readability');//для вытягивания title и content
var bodyParser = require('body-parser');
var cors = require('cors');//для приемки запросов от всех доменов, если cors() - без параметров
                           // и для только определенных доменов если cors(option), где в  option задаются нужные домены

app.use(bodyParser());
app.use(cors());

app.route("/scraper").get(function(req, res) {
    
  var url =  req.query.url;
   
  read(url, function(err, article, meta) {
 
     res.status(res.statusCode).jsonp({
       url: req.query.url,
       title: article.title,
       content: article.content
     });
 
});


});


app.route("/scraper").post(cors(), function(req, res) {
  var url =  req.body.url;
       if(!url){
   return res.sendStatus(400);
 }
   read(url, function(err, article, meta) {
   
     res.status(res.statusCode).json({
       url: req.query.url,
       title: article.title, 
       content: article.content});
    
      myDataRef.child('articles').push({url:url,
                                       title:article.title,
                                       content: article.content});
     /*res.status(res.statusCode).jsonp({url: req.query.url,
     title: article.title, content: article.content});
   */
 
});


});
/*------
    http.get(u, function(res) {
        console.log("Got response: " + res.statusCode);
        // console.log('b  '+res.body);

        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');

        var body = '';
        res.on('data', function(chunk) {
            body += chunk;

            //var title = $(chunk).find('title').text();

            // console.log('BODY: ' + title);
        });

        res.on('end', function() {
            // var data = JSON.parse(body)
            // var title = $(body).find('title').text();

            // var html = $.parseHTML(body);
           // body= body.substr(16);
            // var jQueryEl = $(body);
            // var h = $(body).html() ;
           //   var title = $(h).find('title').text();
          
            console.log('BODY: ' + body);

            // <!--<!DOCTYPE html>-->
            // console.log(data);
        });

    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });




    res.json({url: req.query.url,
        title: req.get('title')});
        -----*/
    //res.redirect(u);

    // myDataRef.push({url: res});
    //also does not work with response.redirect("/about);



/*app.route("/scraper").get(function(req, res) {
 //if(req.query.callback){
 res.status(200).json({url:req.query.url,
 title:'Backend Apps with Webpack: Part I', 
 content: '/the style of its documentation and APIs are not my favorite/'});  
 //}
 })
 */
module.exports = app;
