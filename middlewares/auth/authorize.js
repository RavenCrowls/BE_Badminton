const authorize = (req, res, next) => {
  const { user } = req;
  if (Number(user.roleid) === 2) {
    next();
  } else {
    res.status(403).send("You don't have permission to access this resource");
  }
};

module.exports = { authorize };
