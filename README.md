# Read Later server

This sevice is meant to help to get content of the page without headers,
sidebars and other irrelevant stuff.

## Install

```
git clone ...
cd read-later-server
npm install
npm start
```

## To run tests
```
npm install
npm test
```

## Read Later API URIs

**[GET] /scraper?url=<url>**

Submit a GET request to fetch the content from the provided <url>. This will return a json object with the following fields:

* content
* url
* title

**[GET] /scraper?url=<url>&callback=<callback>**

It supports jsonp protocol. Returns json wrapped in <callback>

**[POST] /scraper** [url: <url>]

Submit a POST request to save data to Firebase.
