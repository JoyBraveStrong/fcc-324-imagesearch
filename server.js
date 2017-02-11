const express = require("express");

const path = require("path");

const getImage = require("./servers/search").getImage;

const getList = require("./servers/history").getList;

const app = express();

const port = process.env.PORT || 3000;

// app.use(express.static(path.resolve(__dirname, "public")));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.get('/favicon.ico', function(req, res) {
  res.sendStatus(200);
});

app.get("/search/:item", (req, res) => {
    getImage(req.params.item, req.query.offset).then(ans => {
        res.json(ans);
    });
});

app.get("/latest", (req, res) => {
    getList((data, err) => {
        if (err) console.log(err);
        res.json(data);
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});
