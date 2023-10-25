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

appRouter.get("/users/:_id/logs", async (req, res) => {
  const id = req.params._id;
  const limit = Number(req.query.limit) || 0;
  // use 1970-01-01 if "from" is not given
  const from = req.query.from || "1970-01-01";
  // use current date if "to" is not given
  const to = req.query.to || new Date().toISOString().slice(0, 10);

  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.sendStatus(404);
    }
    const exercises = await ExerciseModel.find({
      userId: user._id,
      date: { $gte: from, $lte: to },
    })
      .limit(limit)
      .exec();

    return res.status(200).json({
      username: user.username,
      _id: id,
      log: exercises.map((exercise) => {
        return {
          description: exercise.description,
          duration: exercise.duration,
          date: new Date(exercise.date).toDateString(),
        };
      }),
      count: exercises.length,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = appRouter;
