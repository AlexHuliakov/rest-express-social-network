## express-social-network
This is a small social network REST API backend built with Node.js, Express.js, MongoDB and Mongoose, socket.io for realtime updates and mocha+chai for tests. It is a simple API that allows users to create accounts, create and interact with posts. 

Auth is handled with JWT and password encryption with bcrypt.

## Installation

1. Clone the repo and run `npm install` to install all dependencies.

2. Fill the `.env` file with following fields:
    ```
    MONGO_URL='mongodb://localhost:27017/posts'
    APP_PORT=3000
    IMAGE_FOLDER='images'
    JWT_TOKEN='secret'
    JWT_EXPIRES_IN='1h'
    ```

3. Run `npm start` to start the server.

## Usage

There are 2 main routes: `/auth` and `/feed`.

Auth:
- `/auth/signup` - POST - Creates a new user account. Requires `email`, `password` and `name` fields in the request body.
- `/auth/login` - POST - Logs in a user. Requires `email` and `password` fields in the request body.
- `/auth/status` - GET - Returns the current user's status. Requires auth.
- `/auth/status` - PATCH - Updates the current user's status. Requires auth.

Feed:
- `/feed/posts` - GET - Returns all posts. Requires auth.
- `/feed/post` - POST - Creates a new post. Requires `title`, `content` and `image` fields in the request body. Requires auth.
- `/feed/post/:postId` - GET - Returns a single post. Requires auth.
- `/feed/post/:postId` - PUT - Updates a single post. Requires `title`, `content` and `image` fields in the request body. Requires auth.
- `/feed/post/:postId` - DELETE - Deletes a single post. Requires auth.
