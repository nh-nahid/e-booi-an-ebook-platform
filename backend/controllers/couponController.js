const Coupon = require("../models/Coupon");


// create coupon
async function createCoupon(req, res, next) {
    try {
        const coupon = await Coupon.create(req.body);

        res.status(201).json({
            message: "Coupon created successfully",
            coupon,
        });
    } catch (error) {
        next(error);
    }
}

// get all coupons
async function getCoupons(req, res, next) {
    try {
        const coupons = await Coupon.find();

        res.json(coupons);
    } catch (error) {
        next(error);
    }
}

// delete coupon
async function deleteCoupon(req, res, next) {
    try {
        await Coupon.findByIdAndDelete(req.params.id);

        res.json({
            message: "Coupon deleted",
        });
    } catch (error) {
        next(error);
    }
}


// apply coupon
async function applyCoupon(req, res, next) {
    try {
        const { code, amount } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
        });

        if (!coupon) {
            return res.status(404).json({
                message: "Invalid coupon",
            });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({
                message: "Coupon expired",
            });
        }

        if (
            coupon.usageLimit > 0 &&
            coupon.usedCount >= coupon.usageLimit
        ) {
            return res.status(400).json({
                message: "Coupon limit exceeded",
            });
        }

        if (amount < coupon.minimumAmount) {
            return res.status(400).json({
                message: `Minimum order amount is ${coupon.minimumAmount}`,
            });
        }

        let discount = 0;

        if (coupon.type === "percentage") {
            discount = (amount * coupon.value) / 100;
        } else {
            discount = coupon.value;
        }

        res.json({
            coupon,
            discount,
            finalAmount: amount - discount,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createCoupon,
    getCoupons,
    deleteCoupon,
    applyCoupon
}