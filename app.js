require('dotenv').config();
const path = require('path');

const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');

const { IMAGE_FOLDER } = process.env;

const feedRoutes = require('./routes/feed');

const app = express();
app.use(express.json());

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGE_FOLDER); // null is for error
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().toISOString()}-${file.originalname}`);
    }
});

app.use(multer({ storage: fileStorage }).single('image'));

app.use(helmet());

app.use(compression());

const accessLogStream = require('fs').createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream } ));

app.use('/images', express.static(
    path.join(__dirname, IMAGE_FOLDER)
));

app.use('/feed', feedRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const { message } = error;
    res.status(status).json({ message });
});

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(result => {
    console.log('Connected to MongoDB');
    const server = app.listen(process.env.PORT || 3000);
    const io = require('./socket').init(server);
}).catch(err => console.log(err));
