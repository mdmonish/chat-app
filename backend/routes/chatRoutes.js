const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.route("/").post(protect, accessChat); //access chat or create new
router.route("/").get(protect, fetchChats); // fetch all one-on-one chat
router.route("/group").post(protect, createGroupChat); // creating new group
router.route("/rename").put(protect, renameGroup); // renaming existing group
router.route("/groupAdd").put(protect, addToGroup); // adding new user to existing group
router.route("/groupRemove").put(protect, removeFromGroup); // removing user from existing group

module.exports = router;
