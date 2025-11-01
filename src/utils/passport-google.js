const passport = require("passport");
const User = require("../models/users");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        // console.log(profile);

        // Check if user exists
        let user = await User.findOne({ emailId: email });

        if (!user) {
          // Create new user
          user = await User.create({
            logInProvider: "google",
            providerAccountID: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            emailId: email,
            // avatar: profile.photos[0]?.value,
          });
        }

        // // Generate JWT
        // const token = jwt.sign(
        //   { id: user._id, email: user.email },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "7d" }
        // );
        // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        // Pass both user and token
        // return done(null, profile);
        return done(null, { user });
        // return done(email, null);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;