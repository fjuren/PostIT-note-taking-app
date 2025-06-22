# PostIt – A Full-Stack App Focused on UX, Auth, and Real-World Features

PostIt is a secure, server-rendered note-taking app that supports personalized user experiences and emphasizes clean design, accessibility and usability. Built with Node.js, Express, MongoDB, and EJS, it offers more than the basics, integrating real-world features like theming, data export, and account management.

## Features

* **Authentication** via Google OAuth or a built-in test account for demo purposes
* **Metric Dashboard**
   * View various metrics and note metadata, including:
      * Total number of notes
      * Which day of the week is the most productive for taking notes
      * Frequency of notes created month over month
      * Common tags used
      * And more
* **User Preferences** Customize:
   * Display name
   * Default theme (light & dark mode)
   * Primary color
   * Font size and font family
   * Timezone and date format
* **Note Management**
   * View, create, edit, and delete notes
   * Add personal tags to notes
   * Filter notes by tag
* **Account Tools**
   * Delete your account
   * Export your data (`.json`, `.csv`, or `.pdf`)
* **Responsive Design** Looks and works great across mobile, tablet, and desktop devices

## Tech Stack

* **Backend**: Node.js, Express
* **Frontend**: EJS templates, CSS
* **Database**: MongoDB with Mongoose
* **Authentication**: Passport.js with Google OAuth 2.0
* **Testing**: Mocha, Chai, Sinon
* **Utilities**: helmet, dotenv, connect-mongo, method-override, pdfkit, json2csv, luxon

## API Endpoints

The following routes are available in the PostIt application. Most endpoints are protected and require authentication via Google OAuth or the provided test/demo login.

### Authentication Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/auth/google` | Initiates Google OAuth login | ❌ |
| GET | `/auth/google/callback` | OAuth redirect URI after login | ❌ |
| GET | `/auth/logout` | Logs out the current user | ✅ |
| POST | `/auth/demo` | Logs in using a temporary demo account | ❌ |

### Dashboard Routes

| Method | Route        | Description                                                          | Auth Required |
|--------|--------------|----------------------------------------------------------------------|---------------|
| GET    | `/dashboard` | Returns dashboard metrics and chart data for the logged-in user      | ✅            |

### Notes Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/notes` | Retrieves all notes for the current user (supports filtering by tag) | ✅ |
| GET | `/notes/create` | Renders the note creation form | ✅ |
| GET | `/notes/tags` | Returns a list of all tags used by the user | ✅ |
| POST | `/notes` | Creates a new note | ✅ |
| GET | `/notes/:id` | Retrieves a single note for editing | ✅ |
| PUT | `/notes/:id` | Updates a specific note | ✅ |
| DELETE | `/notes/delete/:id` | Deletes a specific note | ✅ |

### User Account Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/user/account` | Renders the user account/preferences page | ✅ |
| PUT | `/user/account/preferences` | Updates user display name, theme, timezone, etc. | ✅ |
| DELETE | `/user/account` | Deletes the user account and associated notes | ✅ |
| POST | `/user/account/export` | Exports user data in `.json`, `.csv`, or `.pdf` formats | ✅ |
| GET | `/user/offboard` | Renders a confirmation/offboarding page | ❌ |

### Dashboard

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| GET | `/dashboard` | Main user dashboard after login | ✅ |

### Error Handling

| Method | Route | Description |
|--------|-------|-------------|
| All | `*` (fallback) | Renders a custom 404 error page |

## Setup and Installation

### 1. Clone the repository

```bash
git clone https://github.com/fjuren/PostIT-note-taking-app.git
cd note-taking-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project with the following values:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
MONGODB_TEST_URI=your_test_db_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
SESSION_SECRET=your_session_secret
NODE_ENV=development
```

### 4. Set up Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project and set up the OAuth consent screen
3. Create OAuth 2.0 credentials
4. Add this redirect URI: `http://localhost:3000/auth/google/callback`
5. Copy the Client ID and Secret into your `.env` file

### 5. Start MongoDB

Ensure your local MongoDB service is running or connect to a remote MongoDB cluster.

### 6. Run the application

```bash
# Development mode with automatic restarts using nodemon
npm run dev

```

### 7. Access the application

Open your browser and navigate to:
```
http://localhost:3000
```

## Testing

This app includes unit tests using Mocha, Chai, and Sinon.

To run tests:

1. Create a `.env` file (or extend your existing one) with a separate test database URI:
   ```env
   MONGODB_TEST_URI=your_test_database_uri
   ```

2. Run the tests:
   ```bash
   npm run test
   ```

## Usage

1. Log in using your Google account or the provided test credentials
2. Navigate to the Notes section to view, create, edit, or delete notes
3. Use tags to organize your notes and filter them
4. Manage your user preferences and appearance settings
5. Export or delete your data from the settings page

## License

MIT License