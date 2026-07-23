require('dotenv').config();

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { findOrCreate, findUserById } = require('./users');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const port = process.env.PORT || 3000

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
  });
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    done(null, findOrCreate(profile));
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    try  {
        const user = findUserById(id);
        done(null, user || false);
    } catch (error) {
        done(error);
    }
});

app.use(session({
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/sekret');
    }

    res.send(`
    <h1>Google OAuth demo</h1>
    <p>Sign in creates your local account the first time you use Google.</p>
    <a href="/auth/google">Continue with Google</a>
   `);
});

app.get('/auth/google', passport.authenticate('google', { scope: [ "profile", "email" ] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/sekret');
    }
);

app.get('/sekret', (req, res) => {
    // console.log("[REQ.USER]:");
    // console.log(req.user);
    res.send(`
    <h1>Top sekret area</h1>
    <img src="${req.user.photo}" alt="User profile photo"
    width="40"
    />
    <p>Hello ${escapeHtml(req.user.name)}.</p>
    <p>The pigeons are not real. They are a very small surveillance team.</p>
    <a href="/logout">Log out</a>
    `);
});

app.get('/logout', (req, res) => {
    req.logout((error) => {
        if (error) {
            return next(error);
        }

        req.session.destroy(() => res.redirect("/"));
    });
});

app.listen(port, () => {
    console.log(`- Visit http://127.0.0.1:${port}`);
});