const jwt = require("jsonwebtoken");

const getUserByToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRECT_KET, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
};

const authCheck = async (req, res, next) => {
  // 1. read the req header
  const headers = req.headers;
  // 2. get the access token from headers
  const accesstoken = headers.accesstoken;
  // 3. if access token is not present in header, then 400
  if (!(accesstoken && accesstoken.startsWith("Bearer "))) {
    return res
      .status(400)
      .send("User does not have access to post the product");
  }
  // get the user info from the token
  const token = accesstoken.split(" ")[1];

  let user;
  try {
    // if token exists then get the user and validate the token
    user = await getUserByToken(token);

    // if token matches with a user, allow him to go next
  } catch (e) {
    // else 400
    return res
      .status(400)
      .send("Authorization token was not provided or was not valid");
  }
  req.user = user.user;
  return next();
};

module.exports = authCheck;
