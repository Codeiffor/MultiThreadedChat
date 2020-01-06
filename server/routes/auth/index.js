import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import authController from "../../controllers/auth";
import asyncMiddleware from "../../middlewares/asyncMiddleware";
const authRouter = Router();

authRouter.post(
  "/signUp",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required()
    })
  }),
  asyncMiddleware(authController.signUp)
);

authRouter.post(
  "/signIn",
  celebrate({
    body: Joi.object().keys({
      username: Joi.string().required(),
      password: Joi.string().required()
    })
  }),
  asyncMiddleware(authController.signIn)
);

export default authRouter;
