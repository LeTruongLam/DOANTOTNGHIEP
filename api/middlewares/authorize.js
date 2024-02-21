import jwt from "jsonwebtoken";

export const authorize = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  // Remove "Bearer " prefix from the token
  const tokenWithoutPrefix = token.replace("Bearer ", "");

  jwt.verify(tokenWithoutPrefix, "jwtkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
    console.log(userInfo);
    req.userInfo = userInfo;
    next();
  });
};