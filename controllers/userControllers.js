import User from "../models/user.js";
import jwt from "jsonwebtoken";
import argon2 from "argon2";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Otp from "../models/otp.js";
import userRouter from "../routes/userRoute.js";

dotenv.config();
export async function postUser(req, res) {
  try {
    const user = req.body;

    console.log(user);

    const checkUser = await User.findOne({ email: user.email });

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

    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);

    const newOtp = new Otp({
      email: user.email,
      otp: otp,
    });

    await newOtp.save();

    sendOtpEmail(user.email, otp);

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
  console.log("running");
  try {
    if (checkIsAdmin(req)) {
      // Get page number and page size from query parameters, set default values
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const email = req.query.email;
      console.log(email);

      // Calculate the number of documents to skip
      const skip = (page - 1) * pageSize;

      // Fetch users with pagination
      const users = await User.find({
        $or: [
          { name: { $regex: email, $options: "i" } }, // name match
          { email: { $regex: email, $options: "i" } }, // age match (number)
        ],
      })
        .skip(skip)
        .limit(pageSize);
      const totalUsers = await User.countDocuments(); // Get total user count

      console.log(users);

      res.status(200).json({
        message: "Fetching data successfully",
        users,
        pagination: {
          currentPage: page,
          pageSize,
          totalUsers,
          totalPages: Math.ceil(totalUsers / pageSize),
        },
      });
    } else {
      const email = req.user.email;
      const customer = await User.findOne({ email });

      if (!customer) {
        return res.status(404).json({
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
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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

    if (user.emailVerified == false) {
      return res.status(404).json({
        message: "Please verify your email before logging in. ",
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

export async function getOneUser(req, res) {
  const email = req.user.email;
  console.log("emaiiiiiiiiiiil", email);
  if (!email) {
    res.status(404).json({
      message: "User not found",
    });
  } else {
    const user = await User.findOne({ email: email });
    console.log(user);
    res.status(200).json({
      message: "found",
      user,
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

export async function deleteUser(req, res) {
  if (!checkIsAdmin(req)) {
    return res.status(403).json({
      message: "Unautherized Access",
    });
  }

  try {
    const email = req.params.email;

    const deleteUser = await User.findOneAndDelete({ email: email });

    console.log(deleteUser);

    if (deleteUser) {
      res.status(200).json({
        message: " User Deleted successfully",
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went a wrong pleasew try again",
      error: error.message,
    });
  }
}

export function sendOtpEmail(email, otp) {
  console.log("otp inside send", otp);
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
    subject: " Validating Otp",
    text: `you Otp is ${otp}`,
  };

  transport.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}

export function verifyUserEmail(req, res) {
  const email = req.body.email;
  const otp = req.body.otp;

  Otp.find({ email: email })
    .sort({ date: -1 })
    .then((otpList) => {
      if (otpList.length == 0) {
        res.status(404).json({
          message: "Otp is invalid",
        });
      } else {
        const latestOtp = otpList[0];
        if (latestOtp.otp == otp) {
          User.findOneAndUpdate({ email: email }, { emailVerified: true }).then(
            () => {
              res.status(200).json({
                message: "User email verified success fully",
              });
            }
          );
        } else {
          res.json({
            message: "otp is invalid",
          });
        }
      }
    });
}

export async function getCurrentUser(req, res) {
  console.log("run this");
  try {
    const currentUserData = req.user;

    if (!currentUserData) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No user data found." });
    }

    res.status(200).json({
      message: "Authorization success",
      user: currentUserData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
