var passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    path = require("path"),
    config = require('rc')('sails');


var verifyHandler = function (token, tokenSecret, profile, done) {
    process.nextTick(function () {
        User.findOne({
                or: [
                    {uid: parseInt(profile.id)},
                    {uid: profile.id}
                ]
            }
        ).exec(function (err, user) {
                if (user) {
                    return done(null, user);
                } else {

                    var data = {
                        provider: profile.provider,
                        uid: profile.id,
                        name: profile.username
                    };

                    if(profile.emails && profile.emails[0] && profile.emails[0].value) {
                        data.email = profile.emails[0].value;
                    }
                    if(profile.name && profile.name.givenName) {
                        data.fistname = profile.name.givenName;
                    }
                    if(profile.name && profile.name.familyName) {
                        data.lastname = profile.name.familyName;
                    }

                    User.create(data).exec(function (err, user) {
                            return done(err, user);
                        });
                }
            });
    });
};

passport.serializeUser(function (user, done) {
    done(null, user.uid);
});

passport.deserializeUser(function (uid, done) {
    User.findOne({uid: uid}).exec(function (err, user) {
        done(err, user)
    });
});


module.exports = {

    // Init custom express middleware
    express: {
        customMiddleware: function (app) {

            passport.use(new GitHubStrategy({
                    clientID: config.auth.github_client,
                    clientSecret: config.auth.github_secret,
                    callbackURL: "http://" + config.auth.hostname + "/auth/github/callback"
                },
                verifyHandler
            ));

            passport.use(new GoogleStrategy({
                    clientID: config.auth.google_client,
                    clientSecret: config.auth.google_secret,
                    callbackURL: "http://" + config.auth.hostname + "/auth/google/callback"
                },
                verifyHandler
            ));

            passport.use(new TwitterStrategy({
                    consumerKey: config.auth.twitter_client,
                    consumerSecret: config.auth.twitter_secret,
                    callbackURL: "http://" + config.auth.hostname + "/auth/twitter/callback"
                },
                verifyHandler
            ));

            app.use(passport.initialize())
                .use(passport.session());

        }
    }

};