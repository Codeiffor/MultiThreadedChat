import { userModel } from "../../models";
import boom from "@hapi/boom";

const authController = {
  signUp: async (req, res) => {
    const data = await userModel.create(req.body);
    return res.json({ data });
  },
  signIn: async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user || !user.validPassword) {
      throw boom.unauthorized("Wrong Username/Email or Password");
    }
    return res.json({ data: user });
  }
};

export default authController;
