module.exports = {
    ensureAuthenticated: function(req, res, next) {
        //return next(); //Uncomment to test
      if (req.isAuthenticated()) {
        return next();
      }
      res.status(400).send('You must be authorized to perform this action!');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.status(200).send('Already authorized!')
    }
};