import { Schema, model } from "mongoose";
import bcypt from "bcrypt";

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const preSave = function() {
  const saltRounds = 10;
  this.password = bcypt.hashSync(this.password, saltRounds);
};

schema.pre("save", preSave);

const userModel = model("user", schema);

userModel.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

export { userModel };
