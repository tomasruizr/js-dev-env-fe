import express from 'express';
import path from 'path';
import open from 'open';
import compression from 'compression';
import env from '../config/env';

/* eslint-disable no-console */

const port = env.distPort;
const app = express();

app.use(compression());
app.use(express.static('dist'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, `../${env.distFolder}/${env.entry}`));
});

app.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});
