import { Schema, model } from "mongoose";

const chatSchema = new Schema({}, { _id: false });
chatSchema.add({
  msg: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    require: true
  },
  chat: [chatSchema]
});

const schema = new Schema(
  {
    users: [String],
    chat: [chatSchema]
  },
  { timestamps: true }
);

const addIndex = (obj, _path = "") => {
  if (obj.chat) {
    obj.chat.forEach((c, index) => {
      const path = `${_path ? `${_path}.` : ""}${index}`;
      console.log(path.split("."));
      c.path = path;
      if (c.chat) {
        addIndex(c, path);
      }
    });
  }
};

const find = function(doc) {
  addIndex(doc);
};

schema.post("findOne", find);
schema.post("save", find);
schema.post("findOneAndUpdate", find);
schema.post("update", find);
schema.post("updateOne", find);
schema.post("updateMany", find);

export const chatModel = model("chat", schema);

// (async () => {
//   // await chatModel.create({
//   //   users: ["sam", "jon"],
//   //   chat: [
//   //     {
//   //       msg: "hey",
//   //       sender: "jon",
//   //       time: Date.now(),
//   //       chat: [
//   // {
//   //   msg: "hi",
//   //   sender: "sam",
//   //   time: Date.now(),
//   //   chat: []
//   // }
//   //       ]
//   //     }
//   //   ]
//   // });

//   // const chat = await chatModel.findOne({}).lean();
//   // chat.forEach(c => addIndex(c));

//   const path = `chat.${"0.0.0.1.0".replace(/[.]/g, ".chat.")}.chat`;

//   console.log(path);
//   const chat = await chatModel.findByIdAndUpdate(
//     "5e14e7af086ec8322e373716",
//     {
//       $push: {
//         [path]: {
//           msg: "UPDATEDMESSAGE3",
//           sender: "sam",
//           time: Date.now(),
//           chat: []
//         }
//       }
//     },
//     {
//       new: true,
//       runValidators: true
//     }
//   );
//   console.log(JSON.stringify(chat, null, 2));
// })();
