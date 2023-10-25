const express = require("express");
const UserModel = require("../models/user");
const ExerciseModel = require("../models/exercise");

const appRouter = express.Router();

appRouter.get("/stats", async (req, res) => {
  const usersCount = await UserModel.countDocuments();
  const exercisesCount = await ExerciseModel.countDocuments();

  res.json({
    users: usersCount,
    exercises: exercisesCount,
  });
});

appRouter.get("/users", async (req, res) => {
  const users = await UserModel.find({});

  return res.send(users);
});

appRouter.post("/users", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.sendStatus(400);
  }
  try {
    const user = await UserModel.create({ username });
    await user.save();
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).send(err);
  }
});

appRouter.post("/users/:_id/exercises", async (req, res) => {
  const { description, duration } = req.body;
  let pDuration = parseInt(duration);
  let date = req.body?.date || new Date().toISOString().substring(0, 10);
  try {
    const user = await UserModel.findById(req.params._id);
    if (isNaN(pDuration)) {
      return res.status(400).send({
        error: "invalid duration",
      });
    }
    if (!user) {
      return res.status(401).send({
        error: "invalid id provided",
      });
    }

    const exercise = await ExerciseModel.create({
      userId: req.params._id,
      username: user.username,
      description,
      date,
      duration: pDuration,
    });
    return res.status(201).json({
      username: user.username,
      _id: user._id,
      description: exercise.description,
      date: new Date(exercise.date).toDateString(),
      duration: exercise.duration,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = appRouter;
