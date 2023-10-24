let mongoose;

try {
  mongoose = require("mongoose");
} catch (err) {
  console.log(err);
}

const ExerciseSchema = mongoose.Schema({
  userId: String,
  username: String,
  description: {
    type: String,
    required: true,
  },
  // duration in mins.
  duration: {
    type: Number,
    required: true,
  },
  date: String,
});

ExerciseSchema.set("versionKey", false);

const ExerciseModel = mongoose.model("exercise_model", ExerciseSchema);

module.exports = ExerciseModel;
