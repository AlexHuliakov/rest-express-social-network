const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/images', express.static(
    path.join(__dirname, 'images')
));

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const { message } = error;
    res.status(status).json({ message });
});

mongoose.connect('mongodb://localhost:27017/posts', { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    console.log('Connected to MongoDB');
    app.listen(3000);
}).catch(err => console.log(err));
