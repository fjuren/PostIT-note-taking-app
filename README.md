# PostIT - a note taking web app

A simple and secure note-taking web application built with Node.js, Express, MongoDB, EJS and Google OAuth authentication.

## Features

- Google OAuth authentication
- Create, read, update, and delete notes
- User-specific notes (each user sees only their own notes)
- Responsive design

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** Passport.js with Google OAuth 2.0
- **Frontend:** EJS templates, Vanilla CSS
- **Other Tools:** dotenv, express-session, connect-mongo, method-override

## Setup and Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd note-taking-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following content:

```
PORT=3000
MONGODB_URI=[insert your own uri]
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

### 4. Set up Google OAuth

- Go to the Google Cloud Console
- Create a new project
- Set up OAuth consent screen
- Create OAuth credentials (OAuth client ID)
- Add `http://localhost:3000/auth/google/callback` as an authorized redirect URI
- Copy your Client ID and Client Secret to the `.env` file

### 5. Start MongoDB

Make sure you have MongoDB running locally or update the MONGODB_URI in your `.env` file to point to your MongoDB instance. Create a cluster if you haven't already and connect using the nodejs option.

### 6. Run the application

```bash
# Development mode with automatic restart
npm run dev

# OR for production
npm start
```

### 7. Access the application

Open your browser and navigate to `http://localhost:3000`

## Usage

1. Login with your Google account
2. Navigate to the Notes section to view, create, edit, or delete notes
3. Create a new note by filling out the form at the bottom of the Notes page
4. Edit a note by clicking the "Edit" button on a note card
5. Delete a note by clicking the "Delete" button on a note card

## License

MIT License