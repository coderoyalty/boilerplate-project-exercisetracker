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
  const username = req.body?.username;
  try {
    const user = await UserModel.create({ username });
    return res.status(201).json({
      _id: user._id,
      username: user?.username,
    });
  } catch (err) {
    return res.status(400).send(err);
  }
});

module.exports = appRouter;
