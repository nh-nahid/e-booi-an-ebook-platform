const express = require("express");

const {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
} = require("../controllers/paymentController");

const {
    checkLogin,
} = require("../middlewares/common/checkLogin");

const router = express.Router();

router.post(
    "/pay/:id",
    checkLogin,
    initiatePayment
);

router.post(
    "/success",
    paymentSuccess
);

router.post(
    "/fail",
    paymentFail
);

router.post(
    "/cancel",
    paymentCancel
);

module.exports = router;