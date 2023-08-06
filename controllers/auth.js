import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export default {
  async signup(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
      error.data = errors.array();
      throw error;
    }

    const { email, name, password } = req.body;
    try {
      const hashedPw = await bcrypt.hash(password, 12);
      const user = new User({
        email: email,
        password: hashedPw,
        name: name
      });
      const result = await user.save();
      res.status(201).json({ message: 'User created!', userId: result._id });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      next(err);
    }
  },

  async login(req, res, next) {
    const { email, password } = req.body;
    let loadedUser;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
      }

      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
      }

      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString()
        },
        process.env.JWT_TOKEN,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(200).json({ token: token, userId: user._id.toString() });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }

      next(err);
    }
  },

  async getUserStatus(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
      }
      res.status(200).json({ status: user.status });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      next(err);
    }
  },

  async updateUserStatus(req, res, next) {
    const newStatus = req.body.status;
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = StatusCodes.NOT_FOUND;
        throw error;
      }

      user.status = newStatus;
      await user.save();

      res.status(200).json({ message: 'User updated.' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }
      next(err);
    }
  }
};
