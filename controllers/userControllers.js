import mongoose from "mongoose";

import User from "../models/user.js";
import jwt from "jsonwebtoken";
export async function postUser(req, res) {
  try {
    const user = req.body;

    console.log(user);

    const checkUser = await User.findOne({ email: user.email });

    console.log("checkuser", checkUser);

    if (checkUser) {
      res.status(400).json({
        message: "Already using this email",
      });

      return;
    }

    const newUser = new User(user);

    newUser.save();

    res.status(201).json({
      message: " User Creation Succesfully",
    });
  } catch (error) {
    res.status(500).json({
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

export async function loginUser(req, res) {
  try {
    const credintials = req.body;

    const user = await User.findOne({
      email: credintials.email,
      password: credintials.password,
    });

    if (user.disabled) {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact the admin.",
      });
    }

    if (!user) {
      return res.status(403).json({
        message: "User not found",
      });
    } else {
      const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastname: user.lastName,
        type: user.type,
      };
      const token = jwt.sign(payload, "secret", { expiresIn: "1h" });

      res.json({
        message: "login successfully",
        // userData: {

        //   firstName: user.firstName,
        //   lastName: user.lastName,
        // },

        user: user,
        token: token,
      });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "Something went wrong while login the user. Please try again later.",
      error: error.message,
    });
  }
}
