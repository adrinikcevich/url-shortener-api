require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const dns = require("dns");

const { get } = require("http");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

let links = [];

app.post("/api/shorturl/", (req, res) => {
  let urlBody= req.body.url
  
  try {
    
    let url = new URL(req.body.url);

    dns.lookup(url.hostname, (error, address, family) => {
      if (error) {
        res.json({ error: "invalid url" });
      } else {
        let search = links.find((link) => link == urlBody);

        if (search) {
          //ADD to array

          res.json({
            original_url: search,
            short_url: links.indexOf(search).toString(),
          });
        } else {
          links.push(urlBody);
          console.log(
            "link agregado en el índice: " +
              links.indexOf(urlBody).toString()
          );

          
          res.json({
            original_url: urlBody,
            short_url: links.indexOf(urlBody).toString(),
          });
        }
      }
    });
  } catch (e) {
    return res.json({ error: "Invalid URL" });
  }
});

app.get("/api/shorturl/:key", (req, res) => {
  let key = req.params.key;
  let url = links[key];
  if (url) {
    res.redirect(url);
  } else {
    res.send({ error: "No short URL found for the given input" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
