/**
 * Parse profile.
 *
 * @param {Object|String} json
 * @return {Object}
 * @api private
 */
exports.parse = function(json) {
  if ('string' === typeof json) {
    json = JSON.parse(json);
  }
  if (json instanceof Array) {
    json = json[0];
  }

  var profile = {};

  profile.id = json.ProfileIdentifier;
  profile.displayName = json.DisplayName;

  if (json.ExternalEmail && json.ExternalEmail.length) {
    profile.emails = [ { value: json.ExternalEmail } ];
  }

  return profile;
};
