import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';
import compression from 'compression';

import socket from './socket.js';
import feedRoutes from './routes/feed.js';
import authRoutes from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use('/images', express.static(
    path.join(__dirname, process.env.IMAGE_FOLDER)
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
    const io = socket.init(server);
}).catch(err => console.log(err));
