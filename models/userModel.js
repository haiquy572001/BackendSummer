const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dbypwy3c0/image/upload/v1620445333/avatar/rubu2hhokllllzjnm4fq.jpg",
    },
    role: {
      type: String,
      default: "user",
    },
    // friends : [{type: mongoose.Types.ObjectId,ref: 'user'}],
    gender: {
      type: String,
      default: "male",
    },
    // story : [
    //     {
    //         type: mongoose.Types.ObjectId,
    //         ref : 'story'
    //     }
    // ],
  },
  {
    timestamp: true,
  }
);
module.exports = mongoose.model("user", userSchema);
