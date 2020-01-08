import { Router } from "express";
import passport from "passport";
import authController from "../../controllers/auth";
import asyncMiddleware from "../../middlewares/asyncMiddleware";

const googleStrategy = require("passport-google-oauth20").Strategy;
const linkedInStrategy = require("passport-linkedin-oauth2").Strategy;

passport.use(
  new googleStrategy(
    {
      clientID: process.env.googleClientId,
      clientSecret: process.env.googleClientSecret,
      callbackURL: `${process.env.serverUrl}/auth/google/redirect`
    },
    authController.oAuth2SignIn(passport, "google")
  )
);

// passport.use(
//   new linkedInStrategy(
//     {
//       clientID: process.env.linkedinClientId,
//       clientSecret: process.env.linkedinClientSecret,
//       callbackURL: `${process.env.serverUrl}/auth/linkedin/redirect`,
//       scope: ["r_emailaddress", "r_liteprofile"],
//       state: true
//     },
//     authController.oAuth2SignIn(passport, "linkedin")
//   )
// );

const authRouter = Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get(
  "/google/redirect",
  passport.authenticate("google"),
  (err, req, res, next) => {
    if (err) {
      return res.redirect(process.env.frontendUrl);
    }
    next();
  },
  asyncMiddleware(authController.oAuth2Redirect)
);

// authRouter.get("/linkedin", passport.authenticate("linkedin"));
// authRouter.get(
//   "/linkedin/redirect",
//   passport.authenticate("linkedin"),
//   (err, req, res, next) => {
//     if (err) {
//       return res.redirect(process.env.frontendUrl);
//     }
//     next();
//   },
//   asyncMiddleware(authController.oAuth2Redirect)
// );

export default authRouter;
