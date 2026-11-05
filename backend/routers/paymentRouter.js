const express = require("express");

const {
    initiatePayment,
    epsSuccess,
    epsFail,
    epsCancel,
} = require("../controllers/paymentController");

const {
    checkLogin, forbidAdmin,
} = require("../middlewares/common/checkLogin");

const router = express.Router();

router.post(
    "/pay/:id",
    checkLogin,
    forbidAdmin,
    initiatePayment
);

// EPS redirects the shopper back with a GET (data in the query string);
// POST is accepted too in case the gateway form-posts instead.
router.get("/eps/success", epsSuccess);
router.post("/eps/success", epsSuccess);
router.get("/eps/fail", epsFail);
router.post("/eps/fail", epsFail);
router.get("/eps/cancel", epsCancel);
router.post("/eps/cancel", epsCancel);

module.exports = router;