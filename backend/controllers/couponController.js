const Coupon = require("../models/Coupon");
const User = require("../models/User");

// Only the editable fields — never usedCount etc. Emails are normalised.
function couponFields(body) {
  const out = {};
  if (body.code !== undefined) out.code = String(body.code).trim().toUpperCase();
  ["type", "value", "minimumAmount", "usageLimit", "isActive"].forEach((f) => {
    if (body[f] !== undefined) out[f] = body[f];
  });
  if (body.expiryDate !== undefined) out.expiryDate = body.expiryDate;
  if (body.allowedEmails !== undefined) {
    const list = Array.isArray(body.allowedEmails)
      ? body.allowedEmails
      : String(body.allowedEmails).split(/[\s,;]+/);
    out.allowedEmails = [...new Set(list.map((e) => String(e).trim().toLowerCase()).filter(Boolean))];
  }
  return out;
}

// update coupon (edit details, activate/deactivate, manage allowed emails)
async function updateCoupon(req, res, next) {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, couponFields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon updated", coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "এই কোড আগে থেকেই আছে" });
    }
    next(error);
  }
}

// create coupon
async function createCoupon(req, res, next) {
  try {
    const coupon = await Coupon.create(couponFields(req.body));

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "এই কোড আগে থেকেই আছে" });
    }
    next(error);
  }
}

// get all coupons
async function getCoupons(req, res, next) {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

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

    if (!code || amount == null) {
      return res.status(400).json({
        message: "Coupon code and amount are required",
      });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Invalid coupon",
      });
    }

    // Restricted coupon (e.g. EB100) — only allowed for specific emails.
    // Respond with the same generic "Invalid coupon" message as a missing
    // coupon so an unauthorized user can't tell the code actually exists.
    if (coupon.allowedEmails && coupon.allowedEmails.length > 0) {
      const requester = await User.findById(req.user.id);
      const requesterEmail = requester?.email?.trim().toLowerCase();
      const isAllowed =
        requesterEmail &&
        coupon.allowedEmails.some(
          (email) => email.trim().toLowerCase() === requesterEmail
        );

      if (!isAllowed) {
        return res.status(404).json({
          message: "Invalid coupon",
        });
      }
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

      // Optional max discount support
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      // Fixed discount should never exceed order amount
      discount = Math.min(coupon.value, amount);
    }

    const finalAmount = Math.max(0, amount - discount);

    res.status(200).json({
      message: "Coupon applied successfully",
      coupon,
      discount,
      finalAmount,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  updateCoupon,
  createCoupon,
  getCoupons,
  deleteCoupon,
  applyCoupon,
};
