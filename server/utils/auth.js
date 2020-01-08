import jwt from "jsonwebtoken";

export const authToken = _id => {
  const payload = { _id };
  return `Bearer ${jwt.sign(payload, process.env.authJWTSecret, { expiresIn: "1d" })}`;
};
