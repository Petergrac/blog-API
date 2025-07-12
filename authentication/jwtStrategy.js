const passport = require("passport");
const { getUserById } = require("../database/userQueries");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Options
const Options = {
  secretOrKey: process.env.SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithms: ["HS256"],
};

// Verify callback
async function verifyCallback(jwt_payload, done) {
  const user = await getUserById(jwt_payload.id);
  if (!user) {
    return done(null, false);
  }
  return done(null, user);
}
// Strategy instance
const strategy = new JwtStrategy(Options, verifyCallback);

// Hooking it to passport
passport.use(strategy);

module.exports = passport;
