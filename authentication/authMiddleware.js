const passport = require("../authentication/jwtStrategy");
function authenticateJwt(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      if (info && info.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      if (info && info.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  })(req, res, next);
}

module.exports = authenticateJwt;
