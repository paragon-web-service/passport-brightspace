/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , Profile = require('./profile')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Brightspace authentication strategy authenticates requests by delegating to
 * Brightspace using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `host`          your Brightspace application's host
 *   - `clientID`      your Brightspace application's Client ID
 *   - `clientSecret`  your Brightspace application's Client Secret
 *   - `callbackURL`   URL to which Brightspace will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new BrightspaceStrategy({
 #         host: 'http://brightspace.example.net/',
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         callbackURL: 'https://www.example.net/auth/brightspace/callback',
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};

  console.log(`Configuring strategy with options:`, options);

  options.authorizationURL = options.authorizationURL || `https://auth.brightspace.com/oauth2/auth`;
  options.tokenURL = options.tokenURL|| `https://auth.brightspace.com/core/connect/token`;
  options.scopeSeparator = options.scopeSeparator || ',';
  options.customHeaders = options.customHeaders || {};

  OAuth2Strategy.call(this, options, verify);
  this.name = 'brightspace';
  this._userProfileURL = options.userProfileURL || `${options.host}/api/lp/1.19/profile/myProfile`;
  this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Brightspace.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `brightspace`
 *   - `id`               the user's Brightspace ID
 *   - `username`         the user's Brightspace username
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on Brightspace
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var self = this;

  this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
    var json;

    if (err) {
      return done(new InternalOAuthError('Failed to fetch user profile', err));
    }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);
    profile.provider  = 'brightspace';
    profile._raw = body;
    profile._json = json;

    done(null, profile);
  });
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
