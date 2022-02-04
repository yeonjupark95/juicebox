// api/utils.js
// middleware
function requireUser(req, res, next) {
  if (!req.user) {
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }
  next();
}

module.exports = {
    requireUser
}

//overloaded function: multiple functions for 1 function name
// 4 parameters -> error handling middleware
// 3 parameters -> regular middleware

//you can end the middleware by using res.send or next