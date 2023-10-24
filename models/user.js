let mongoose;

try {
  mongoose = require("mongoose");
} catch (err) {
  console.log(err);
}

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
});

UserSchema.set("versionKey", false);

const UserModel = mongoose.model("exercise_tracker_user", UserSchema);

module.exports = UserModel;
