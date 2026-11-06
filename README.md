# WTWR (What to Wear?): Back End

## Overview

WTWR is a RESTful back-end API for a clothing recommendation application. The server stores users and clothing items in MongoDB and supports creating and retrieving users, retrieving and deleting clothing items, and adding or removing likes from items.

The API uses Express routes and controllers, Mongoose models and schemas, and JSON request and response bodies. It also validates input data and ObjectIds and returns consistent 400, 404, and 500 error responses.

## Technologies and Techniques

- **Node.js** runs the server-side JavaScript application.
- **Express.js** handles routing, middleware, requests, and JSON responses.
- **MongoDB** stores users and clothing items.
- **Mongoose** defines schemas and models, performs database operations, and provides built-in and custom validation.
- **Validator.js** validates avatar and clothing image URLs.
- **ESLint with the Airbnb Base configuration** enforces consistent JavaScript style and identifies code issues.
- **Nodemon** automatically restarts the server when project files change during development.
- **REST API routing** separates user and clothing-item routes from controller logic.
- **Promise-based error handling** checks Mongoose validation and database errors and maps them to appropriate HTTP responses.

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB running locally

### Installation

```bash
npm install
```

MongoDB is expected to be available locally at:

```text
mongodb://localhost:27017/wtwr_db
```

### Running the Server

Start the server normally:

```bash
npm run start
```

Start the server with hot reload:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:3001
```

### Linting

Run the linter with:

```bash
npm run lint
```

## API Routes

### Users

| Method | Route | Description |
| --- | --- | --- |
| GET | `/users` | Returns all users |
| GET | `/users/:userId` | Returns one user by ID |
| POST | `/users` | Creates a user |

Example user request body:

```json
{
  "name": "Alex",
  "avatar": "https://example.com/avatar.png"
}
```

### Clothing Items

| Method | Route | Description |
| --- | --- | --- |
| GET | `/items` | Returns all clothing items |
| POST | `/items` | Creates a clothing item |
| DELETE | `/items/:itemId` | Deletes a clothing item |
| PUT | `/items/:itemId/likes` | Adds the current user's ID to the item's likes |
| DELETE | `/items/:itemId/likes` | Removes the current user's ID from the item's likes |

Example clothing item request body:

```json
{
  "name": "Winter coat",
  "weather": "cold",
  "imageUrl": "https://example.com/coat.png"
}
```

## Data Validation

User fields:

- `name`: required string between 2 and 30 characters
- `avatar`: required valid URL string

Clothing item fields:

- `name`: required string between 2 and 30 characters
- `weather`: required value of `hot`, `warm`, or `cold`
- `imageUrl`: required valid URL string
- `owner`: required user ObjectId
- `likes`: array of user ObjectIds
- `createdAt`: creation date

## Error Handling

The API returns:

- `400 Bad Request` for invalid data and invalid IDs
- `404 Not Found` for missing resources or routes
- `500 Internal Server Error` for unexpected server errors

Error responses contain a JSON `message` field describing the error.
