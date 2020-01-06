import { isCelebrate } from "celebrate";
import boom from "@hapi/boom";

const errorHandler = (err, req, res, next) => {
  console.log(err);
  // @hapi/boom error
  if (err.isBoom) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  // celebrate error
  if (isCelebrate(err)) {
    const err = boom.badRequest("Invalid Data");
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  // default
  res.sendStatus(500);
};

export default errorHandler;
