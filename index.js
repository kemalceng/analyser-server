import routes from './api/routes';
import express from 'express';
import { urlencoded, json } from 'body-parser';

var app = express();
var port = process.env.PORT || 3333;

export let analysisDataCache = {};

app.use(urlencoded({ extended: true }));
app.use(json());

routes(app);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' })
});

app.listen(port);
console.log("Body signal analyser listening on : " + port);