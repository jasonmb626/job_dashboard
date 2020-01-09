const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000;

const db = require('./config/db');

app.use('/api/templates', require('./api/templates'));
app.use('/api/companies', require('./api/companies'));
app.use('/api/jobs', require('./api/jobs'));
app.use('/api/users', require('./api/users'));
app.use('/api/auth', require('./api/auth'));

app.get('/api/testTime', (req, res) => {
    res.json(Date.now());
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
