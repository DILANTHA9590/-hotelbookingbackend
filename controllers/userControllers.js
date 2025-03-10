import User from "../models/user.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";

dotenv.config();
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

    //hash user password

    const hashPassword = await argon2.hash(user.password);

    user.password = hashPassword;

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
    const credentials = req.body;

    console.log(req.body);

    const user = await User.findOne({
      email: credentials.email,
    });

    if (!user) {
      return res.status(403).json({
        message: "User not found",
      });
    }

    if (user.disabled) {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact the admin.",
      });
    }

    // Verify the password using argon2
    const isMatch = await argon2.verify(user.password, credentials.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid email or password" });
    } else {
      const payload = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        type: user.type,
      };

      // Create a JWT token
      const token = jwt.sign(payload, process.env.SECRET_KEY);
      console.log(token);

      res.json({
        message: "Login successfully",
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type,
        },
        token: token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong while logging in. Please try again later.",
      error: error.message,
    });
  }
}

export function checkIsAdmin(req) {
  if (!req.user) {
    return false;
  }

  if (req.user.type != "admin") {
    return false;
  }

  return true;
}

export function checkIsCustomer(req) {
  if (!req.user) {
    return false;
  }

  if (req.user.type != "customer") {
    return false;
  }

  return true;
}

export function getOneUser(req, res) {
  const user = req.user;

  if (!user) {
    res.status(404).json({
      message: "User not found",
    });
  } else {
    res.status(200).json({
      message: "ufound",
      user: user,
    });
  }
}
