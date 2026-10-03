const express = require('express');
const app = express();

const port = process.env.PORT || 7000;
const mongoose = require('mongoose');
const session = require("express-session");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LoginData = require("./models/loginSchema");

const dotenv = require("dotenv");
dotenv.config();

var methodOverride = require('method-override')
const AllRoutes = require('./routes/AllRoutes')

// ================= Middleware =================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// for Ejs
app.set('view engine', 'ejs');

// Method Override
app.use(methodOverride('_method'))


// ================= Session =================
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
// ================= Passport =================
app.use(passport.initialize());


// ================= Google Strategy =================

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;

                if (!email) {
                    return done(new Error("Google account has no email"));
                }

                // Check if user already exists
                let user = await LoginData.findOne({ email });

                if (!user) {
                    // Create new Google user
                    user = await LoginData.create({
                        name: profile.displayName,
                        email: email,
                        googleId: profile.id,
                        photo: profile.photos?.[0]?.value,
                    });
                } else {
                    // Link Google account to existing user
                    if (!user.googleId) {
                        user.googleId = profile.id;
                    }

                    if (profile.photos?.[0]?.value) {
                        user.photo = profile.photos[0].value;
                    }

                    await user.save();
                }

                done(null, user);

            } catch (error) {
                done(error, null);
            }
        }
    )
);


// ================= Google Login =================

// Step 1: Send user to Google
app.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);


// Step 2: Google sends user back here
app.get(
    "/auth/google/callback",

    passport.authenticate("google", {
        failureRedirect: "/login",
        session: false,
    }),

    (req, res) => {

        // Save user in our Express session
        req.session.user = {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            photo: req.user.photo,
        };

        res.redirect("/profile");
    }
);

// End Points
// ================= Routes =================
app.use(AllRoutes)



mongoose.connect(process.env.MONGO_URI)
    .then(
        () => {
            // app.listen(port, () => { console.log(`DB Connected Successfully http://localhost:${port}`); });
            console.log("DB Connected Successfully");
        }
    ).catch((err) => { console.log(err); });



module.exports = app;