const express = require('express');
const app = express();
const secret = 'GUARD';
const config = require('./config');
const guard = require('../index')(config, secret, {}, {});

app.use(guard.guard);

app.use('/getonly', (req, res, next) => {
  res.status(200).send('success');
});

app.use('/allmethods', (req, res, next) => {
  res.status(200).send('success');
});

app.use('/require2perms', (req, res, next) => {
  res.status(200).send('success');
});

const router = require('express').Router();
router.get('/user/:id', guard.guard, (req, res, next) => {
  res.status(200).send('success');
});

app.use('/route', router);

const server = app.listen(3000, () => {
  console.log('\tTest server started');
});

module.exports = {
  server,
  sign: guard.issuer,
};
