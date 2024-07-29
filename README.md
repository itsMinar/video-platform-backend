# VideoTube - Video Platform Backend API

### This repository contains the backend service for VideoTube, a video platform. The service is built with Node.js, Express.js, MongoDB (Mongoose), and Cloudinary.

## Table of Contents

- [Features](#features)
- [Installation and Running the Server](#installation-and-running-the-server)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [User](#user)
  - [Video](#video)
  - [Subscription](#subscription)
  - [Playlist](#playlist)
  - [Like](#like)
  - [Comment](#comment)
  - [Dashboard](#dashboard)
  - [Tweet](#tweet)
- [Environment Variables](#environment-variables)

## Features

### User Authentication and Management

- **User Registration**: Allows new users to create an account by providing necessary details such as username, email, and password.
- **User Login**: Users can log in to their accounts using their email and password.
- **Token-based Authentication**: Implements JWT for secure user authentication and authorization.
- **Refresh Tokens**: Supports token refresh to keep users logged in without requiring frequent logins.
- **User Profile Management**: Users can view and update their profile details, including changing passwords and updating avatar and cover images.
- **Account Security**: Provides endpoints for users to change their password to maintain account security.
- **Logout**: Users can log out of their accounts, invalidating their current session.

### Video Uploading and Management

- **Video Upload**: Users can upload videos to the platform, with the videos being stored and managed using Cloudinary.
- **Video Details Management**: Users can update video details such as title, description.
- **Video Retrieval**: Allows retrieval of all videos or specific videos by ID.
- **Video Deletion**: Users can delete their own videos from the platform.

### Subscription Management

- **Subscribe/Unsubscribe Channels**: Users can subscribe to or unsubscribe from other user channels.
- **Subscription Status**: Check the subscription status of channels.
- **Subscribers and Subscribed Channels**: Retrieve the list of subscribers to a user's channel and the list of channels a user is subscribed to.

### Playlist Creation and Management

- **Create Playlist**: Users can create new playlists to organize their favorite videos.
- **Update Playlist**: Users can update playlist details such as title and description.
- **Delete Playlist**: Users can delete their own playlists.
- **Manage Playlist Videos**: Add or remove videos from playlists.
- **Retrieve Playlists**: Get details of specific playlists and all playlists created by a user.

### Video Liking and Commenting

- **Like/Dislike Videos**: Users can like or dislike videos.
- **Comment on Videos**: Users can add comments to videos to engage with other users.
- **Manage Comments**: Users can update or delete their own comments on videos.
- **Like/Dislike Comments**: Users can like or dislike comments on videos.

### User Channel Statistics and Video Management

- **Channel Statistics**: Provides various statistics about a user's channel, such as the number of subscribers, total views, etc.
- **Channel Videos**: Retrieve all videos uploaded by a user to their channel.

### Tweet Creation and Management

- **Create Tweets**: Users can post tweets, which can be used for short updates or announcements.
- **Manage Tweets**: Users can update or delete their own tweets.
- **Retrieve User Tweets**: Get all tweets posted by a specific user.

## Installation and Running the Server

1. Clone the project repository:

   ```bash
   git clone https://github.com/itsMinar/video-platform-backend.git
   ```

2. Navigate to the project directory.

   ```bash
   cd video-platform-backend
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables)).

### Run Normally

1. Ensure you have [NodeJs](https://www.nodejs.org/), [MongoDB](https://www.mongodb.com) and [MongoDB Compass (optional)](https://www.mongodb.com/products/compass) installed on your machine.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

### Run with Docker

1. Ensure you have [Docker](https://www.docker.com) installed on your machine.

2. Start the server:

   ```bash
   docker-compose up -d
   ```

## Usage

Once the server is running, you can interact with the API using an HTTP client like Postman or through your frontend application.

## API Endpoints

### User

- `POST /api/v1/users/register`: Register a new user
- `POST /api/v1/users/login`: Log in a user
- `POST /api/v1/users/logout`: Log out the current user
- `POST /api/v1/users/refresh-token`: Refresh the access token
- `GET /api/v1/users/current-user`: Get the current user's information
- `POST /api/v1/users/change-password`: Change the current user's password
- `PATCH /api/v1/users/update-account`: Update the current user's account details
- `PATCH /api/v1/users/avatar`: Update the current user's avatar
- `PATCH /api/v1/users/cover-image`: Update the current user's cover image
- `GET /api/v1/users/c/:username`: Get a user's channel profile
- `GET /api/v1/users/history`: Get the current user's watch history

### Video

- `GET /api/v1/videos`: Get all videos
- `POST /api/v1/videos`: Upload a new video
- `GET /api/v1/videos/:videoId`: Get a video by ID
- `PATCH /api/v1/videos/:videoId`: Update a video
- `DELETE /api/v1/videos/:videoId`: Delete a video

### Subscription

- `POST /api/v1/subscriptions/c/:channelId`: Toggle subscription
- `GET /api/v1/subscriptions/c/:channelId`: Get a user's channel subscribers
- `GET /api/v1/subscriptions/u/:subscriberId`: Get subscribed channels

### Playlist

- `POST /api/v1/playlists`: Create a new playlist
- `GET /api/v1/playlists/:playlistId`: Get a playlist by ID
- `PATCH /api/v1/playlists/:playlistId`: Update a playlist
- `DELETE /api/v1/playlists/:playlistId`: Delete a playlist
- `PATCH /api/v1/playlists/add/:videoId/:playlistId`: Add a video to a playlist
- `PATCH /api/v1/playlists/remove/:videoId/:playlistId`: Remove a video from a playlist
- `GET /api/v1/playlists/user/:userId`: Get the current user's playlists

### Like

- `GET /api/v1/likes/videos`: Get liked videos
- `POST /api/v1/likes/toggle/v/:videoId`: Toggle like on a Video
- `POST /api/v1/likes/toggle/c/:commentId`: Toggle like on a Comment
- `POST /api/v1/likes/toggle/t/:tweetId`: Toggle like on a Tweet

### Comment

- `GET /api/v1/comments/:videoId`: Get comments for a video
- `POST /api/v1/comments/:videoId`: Add a comment
- `PATCH /api/v1/comments/c/:commentId`: Update a comment
- `DELETE /api/v1/comments/c/:commentId`: Delete a comment

### Dashboard

- `GET /api/v1/dashboard/stats`: Get channel statistics
- `GET /api/v1/dashboard/videos`: Get channel videos

### Tweet

- `POST /api/v1/tweets`: Create a new tweet
- `GET /api/v1/tweets/user/:userId`: Get the current user's tweets
- `PATCH /api/v1/tweets/:tweetId`: Update a tweet
- `DELETE /api/v1/tweets/:tweetId`: Delete a tweet

### Health Check

- `GET /api/v1/health-check`: Check the Application health that everything is ok or not

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```plaintext
PORT=8000
CORS_ORIGIN=*

MONGODB_URI=your-mongodb-url-connection-string

ACCESS_TOKEN_SECRET=your-jwt-secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your-info
CLOUDINARY_API_KEY=your-info
CLOUDINARY_API_SECRET=your-info
```
