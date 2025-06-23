const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://tellmeyourneed-production.up.railway.app/auth/google/peerpick",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        if (!email.endsWith("@umt.edu.pk")) return done(null, false);
        const user = { googleId: profile.id, name: profile.displayName, email };
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const googleAuth = (app) => {
    app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

    app.get("/auth/google/peerpick", passport.authenticate("google", { failureRedirect: "/unauthorized" }), async (req, res) => {
        try {
            const email = req.user?.email;
            if (!email) throw new Error("User email not found");

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.redirect("https://tellmeyourneed.vercel.app/login?message=You%20are%20already%20registered,%20please%20login");
            }

            const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });
            res.redirect(`https://tellmeyourneed.vercel.app/register?token=${token}`);
        } catch (error) {
            console.error("Google Sign-in Error:", error);
            res.redirect("https://tellmeyourneed.vercel.app/login?message=An%20error%20occurred");
        }
    });

    app.get("/unauthorized", (req, res) => {
        res.redirect("https://tellmeyourneed.vercel.app/login?message=Please%20register%20with%20UMT%20Email");
    });
};

module.exports = googleAuth;
