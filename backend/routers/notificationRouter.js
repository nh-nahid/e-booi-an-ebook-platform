const express = require("express");

const {
  getNotifications,
  markAllRead,
  markRead,
  removeNotification,
} = require("../controllers/notificationController");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

router.use(checkLogin);

router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markRead);
router.delete("/:id", removeNotification);

module.exports = router;
