import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export default (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = StatusCodes.UNAUTHORIZED;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  } catch (err) {
    err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated.');
    error.statusCode = StatusCodes.UNAUTHORIZED;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
