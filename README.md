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

**[GET] /scraper?url=&lt;url&gt;**

Submit a GET request to fetch the content from the provided &lt;url&gt;. This will return a json object with the following fields:

* content
* url
* title

**[GET] /scraper?url=&lt;url&gt;&callback=&lt;callback&gt;**

It supports jsonp protocol. Returns json wrapped in &lt;callback&gt;

**[POST] /scraper** [url: &lt;url&gt;]

Submit a POST request to save data to Firebase.
