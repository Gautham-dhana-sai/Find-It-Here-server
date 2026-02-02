const jwt = require("jsonwebtoken");
const { encrypt } = require("../library/encryption");

const jwtAuth = (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      res.status(401).json({ response: "Token not found" });
      return;
    }
    
    jwt.verify(token, process.env.JWT_KEY, (err, creds) => {
      if (err) {
        return res
          .status(401)
          .json(encrypt({ auth: false, response: "Failed to Authenticate token" }));
        }
        req.user = creds;
        next();
      });
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json(encrypt({ auth: false, response: "Failed to Authenticate token" }));
    
  }
};

module.exports = {jwtAuth};
