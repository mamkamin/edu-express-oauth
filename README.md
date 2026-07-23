# Google OAuth Express Demo

A minimal Express application showing Google sign-in as both registration and login. On a person's first successful Google login, the app stores a local user record in `data/users.json`. Later Google logins find that record and start a session.

## Setup

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project.
2. Configure the OAuth consent screen. Add yourself as a test user while the app is in testing mode.
3. Create an **OAuth client ID** with application type **Web application**.
4. Add `http://localhost:3000/auth/google/callback` to **Authorized redirect URIs**.
5. Update `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `SESSION_SECRET` in `.env`.
6. Install and run the app:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000), choose **Continue with Google**, and approve the requested profile and email access.

## Routes

| Route | Purpose |
| --- | --- |
| `GET /` | Shows the Google sign-in link, or redirects logged-in people to `/sekret`. |
| `GET /auth/google` | Starts the Google OAuth authorization flow. |
| `GET /auth/google/callback` | Google redirects here after the user approves or rejects sign-in. |
| `GET /sekret` | Protected page; redirects to `/` without a valid session. |
| `GET /logout` | Ends the current session. |

## Learning Notes

Google verifies the person's identity. This application then creates its own session cookie, which Passport uses to restore the person on later requests. The default in-memory session store and JSON user file are intentionally simple for learning only; use a database and production session store in a real application.

## References

- [Passport.js Google OAuth 2.0](https://www.passportjs.org/packages/passport-google-oauth20/)