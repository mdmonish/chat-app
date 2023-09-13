const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUserApi = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User Already exits");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });
  console.log(password, await userExists.matchPassword(password));
  if (userExists && (await userExists.matchPassword(password))) {
    res.json({
      _id: userExists._id,
      name: userExists.name,
      email: userExists.email,
      pic: userExists.pic,
      token: generateToken(userExists._id),
    });
  } else {
    throw new Error("Password is incorrect");
  }
});

// all users  api/user?search=name

const allUsers = asyncHandler(async (req, res) => {
  const searchKeyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};

  const users = await User.find(searchKeyword).find({
    _id: {
      $ne: req.user._id,
    },
  });
  res.send(users);
});

module.exports = { registerUserApi, authUser, allUsers };
