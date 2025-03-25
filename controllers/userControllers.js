import User from "../models/user.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Otp from "../models/otp.js";

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

export async function getUser(req, res) {
  console.log("runnig");
  try {
    if (checkIsAdmin) {
      const users = await User.find();
      console.log(users);

      res.status(200).json({
        message: "Fetching data sucsessfully",
        users,
      });
    } else {
      const email = req.user.email;

      const customer = await User.findOne({ email: email });

      if (!customer) {
        return res.status.json({
          message: "User Not Found",
        });
      }
      const customerData = {
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        whatsApp: customer.whatsApp,
        phone: customer.phone,
        type: customer.type,
      };
      res.status(200).json({
        customerData,
      });
    }
  } catch (error) {}
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

    if (user.disabled == true) {
      return res.status(403).json({
        message: "Your account has been suspended. Please contact the admin.",
      });
    }

    // Verify the password using argon2
    const isMatch = await argon2.verify(user.password, credentials.password);
    if (!isMatch) {
      return res.status(200).json({ message: "Invalid email or password" });
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
      message: "found",
      user: user,
    });
  }
}

export async function updateUserIsBlock(req, res) {
  if (!checkIsAdmin(req)) {
    return res.status(403).json({
      message: "Unautherized access",
    });
  }
  try {
    const checkIsHave = await User.findOne({ email: req.params.email });

    console.log(checkIsHave);

    if (!checkIsHave) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.updateOne({ email: req.params.email }, req.body);

    res.status(200).json({
      message: "User block status update successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Some thing went a wrong please try again",
    });
  }
}

export function sendSampleEmail(email, otp) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "dilantha9590@gmail.com",
      pass: "iqnlaugybucodexw",
    },
  });

  const message = {
    from: "dilantha9590@gmail.com",
    to: email,
    subject: " Sample Email",
    text: "This is a sample email",
  };

  transport.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}
