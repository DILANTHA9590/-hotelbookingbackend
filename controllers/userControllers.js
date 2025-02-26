import mongoose from "mongoose";

import User from "../models/user.js";

export async function postUser(req, res) {
  try {
    const user = req.body;

    const newUser = new User(user);
    newUser.save();

    res.json({
      message: " User Creation Succesfully",
    });
  } catch (error) {
    res.json({
      message: "user Creation Unsuccessfull !",
      error: error.message,
    });
  }
}

export function getUser(req, res) {
  const user = req.body;

  User.find().then((userList) => {
    res.json({
      list: userList,
    });
  });
}
