import crypto from "crypto";
import { userModel } from "../../models";
import { authToken } from "../../utils/auth";

const authController = {
  oAuth2SignIn: (passport, type) => async (accessToken, refreshToken, _profile, cb) => {
    try {
      const profile = JSON.parse(JSON.stringify(_profile), (key, value) => {
        if (key.slice(0, 1) !== "_") return value;
      });
      console.log(profile);

      const { id, emails, name: _name, displayName, photos } = profile;
      const email = emails[0].value;
      const name = _name.givenName ? `${_name.givenName || ""} ${_name.familyName || ""}`.trim() : displayName;
      const username = `${name.toLowerCase().replace(/[^a-zA-Z]/g, "")}-${crypto.randomBytes(2).toString("hex")}`;
      const image = photos.length && photos[0].value ? photos[0].value : null;

      const details = {
        email,
        username,
        name,
        image,
        [`${type}`]: profile
      };

      console.log(details);

      let user = await userModel.findOne({ [`${type}.id`]: id });
      if (!user) {
        user = await userModel.findOneAndUpdate(
          { email },
          { [`${type}`]: { id, profile } },
          { new: true, runValidators: true }
        );
        if (!user) {
          user = await userModel.create(details);
        }
      }

      passport.serializeUser((user, done) => {
        done(null, { _id: user._id });
      });
      passport.deserializeUser((user, done) => {
        done(null, { _id: user._id });
      });
      return cb(null, user);
    } catch (err) {
      console.log(err);
      return cb(err);
    }
  },

  oAuth2Redirect: async (req, res) => {
    const token = authToken(req.user._id);
    res.cookie("token", token);
    res.redirect(process.env.frontendUrl);
  }
};

export default authController;
