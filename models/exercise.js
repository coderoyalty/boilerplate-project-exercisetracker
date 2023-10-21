let mongoose;

try {
  mongoose = require("mongoose");
} catch (err) {
  console.log(err);
}

const ExerciseSchema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  // duration in mins.
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

const ExerciseModel = mongoose.model("exercise_model", ExerciseSchema);

module.exports = ExerciseModel;
