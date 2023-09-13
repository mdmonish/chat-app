const express = require("express");
const {
  registerUserApi,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUserApi);
router.post("/login", authUser);

// 10- all users with a search query
router.route("/").get(protect, allUsers);

module.exports = router;
