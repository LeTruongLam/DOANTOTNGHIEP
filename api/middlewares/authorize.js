import jwt from "jsonwebtoken";

export const authorize = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }
  const tokenWithoutPrefix = token.replace("Bearer ", "");
  jwt.verify(tokenWithoutPrefix, "jwtkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
    req.userInfo = userInfo;
    next();
  });
};
