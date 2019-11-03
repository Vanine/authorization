const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

module.exports = function(passport) {  
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'jwtsecret'
  }, function(payload, done) {
    User.findById(payload.userId, function(err, user) {      
      if(err) return done(err, false);
      if(user) return done(null, user);
      else return done(null, false);
    })
  }))
}