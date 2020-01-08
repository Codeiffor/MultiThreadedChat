import { Schema, model } from "mongoose";
import bcypt from "bcrypt";

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    google: {},
    linkedin: {}
  },
  { timestamps: true }
);

const preSave = function() {
  const saltRounds = 10;
  if (this.password) this.password = bcypt.hashSync(this.password, saltRounds);
};

schema.pre("save", preSave);

const userModel = model("user", schema);

userModel.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

export { userModel };
