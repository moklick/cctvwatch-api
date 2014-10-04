/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://links.sailsjs.org/docs/config/http
 */

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

module.exports.http = {

  middleware: {

    // The order in which middleware should be run for HTTP request.
    // (the Sails router is invoked by the "router" middleware below.)
    order: [
      'startRequestTimer',
      'cookieParser',
      'session',
      'bodyParser',
      'handleBodyParserError',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

    // The body parser that will handle incoming multipart HTTP requests.
    // By default as of v0.10, Sails uses [skipper](http://github.com/balderdashy/skipper).
    // See http://www.senchalabs.org/connect/multipart.html for other options.
    // bodyParser: require('skipper')

  },

  customMiddleware: function(app) {

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

  },

  // The number of seconds to cache flat files on disk being served by
  // Express static middleware (by default, these files are in `.tmp/public`)
  //
  // The HTTP static cache is only active in a 'production' environment,
  // since that's the only time Express will cache flat-files.
  cache: 31557600000
};
