import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator"; //see docs.

const SECRET_KEY = process.env.JWT_SECRET_KEY;

//signup user
export const signUpUser = async (req, res) => {
  try {
    const errors = validationResult(req); //checking for error
    if (errors.isEmpty()) {
      const existedUser = await User.findOne({ email: req.body.email });
      if (existedUser) {
        return res.status(400).send("email already in use");
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        image: req.body.image,
        isAdmin: req.body.isAdmin,
      });
      const token = jwt.sign({ _id: user._id }, SECRET_KEY);
      const { password, ...otherInfo } = user._doc; //user._doc contains user info

      return res.status(200).send({ ...otherInfo, token: token });
    } else {
      return res.status(400).send(errors);
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

//login user
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ error: "invalid credentials" });
    }
    const matchedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!matchedPassword) {
      return res.status(404).send({ error: "invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id }, SECRET_KEY);

    const { password, ...otherInfo } = user._doc;
    return res.status(200).send({ ...otherInfo, token: token });
  } catch (error) {
    res.status(500).send(error);
  }
};

//get user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); //select method on User for selecting all fields, for excluding password use "-password"
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

//get all users
export const getAllUsers = async (req, res) => {
  try {
    const { name } = req.query;
    let querySearch = {};

    if (name) {
      querySearch.name = {
        $regex: name,
        $options: "i",
      };
    }

    const users = await User.find(querySearch).sort({ createdAt: -1 }); //sorting users by latest created
    res.status(201).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

//get all users statistics
export const getAllUsersStats = async (req, res) => {
  const date = new Date();
  //console.log(date);
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  //console.log(lastYear); //last year today

  try {
    const data = await User.aggregate([
      {
        $match: { createdAt: { $gte: lastYear } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

//update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;
    const updatedUser = {};

    if (name) {
      updatedUser.name = name;
    }
    if (email) {
      updatedUser.email = email;
    }
    if (password) {
      updatedUser.password = password;
    }

    if (image) {
      updatedUser.image = image;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, {
      new: true,
    });
    if (!user) {
      return res.status(404).send(error);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    //console.log(hashedPassword);
    user.password = hashedPassword;
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

//delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send(error);
    }
    res
      .status(200)
      .send({ success: "user has been deleted successfully", user: user });
  } catch (error) {
    res.status(400).send(error);
  }
};

//logout
export const logout = async (req, res) => {
  try {
    req.user.token = "";
    await req.user.save();
    res.status(200).send("You are successfully logged out.");
  } catch (e) {
    res.status(500).send(e);
  }
};
