const express = require('express');

const languages = require('../routes/languages');

const app = express();

app.use('/api/v2/languages', languages);

module.exports = app;