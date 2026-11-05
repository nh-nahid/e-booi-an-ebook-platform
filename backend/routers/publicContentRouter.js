const express = require("express");
const { getAuthor } = require("../controllers/authorController");
const { listPlans, mySubscription, createSubscriptionOrder } = require("../controllers/subscriptionController");
const { checkLogin } = require("../middlewares/common/checkLogin");
const router = express.Router();

router.get("/author", getAuthor);
router.get("/plans", listPlans);
router.get("/subscription", checkLogin, mySubscription);
router.post("/plans/:planId/order", checkLogin, createSubscriptionOrder);

module.exports = router;
