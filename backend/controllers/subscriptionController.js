const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const Order = require("../models/Order");
const User = require("../models/User");
const { notifyUser } = require("../utils/notify");
const { activeSubscription } = require("../utils/access");

const DAY = 24 * 60 * 60 * 1000;

/* ---------- public / user ---------- */

async function listPlans(req, res, next) {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ order: 1, price: 1 });
    res.json({ data: plans });
  } catch (e) {
    next(e);
  }
}

async function mySubscription(req, res, next) {
  try {
    const sub = await activeSubscription(req.user.id);
    res.json({ data: sub });
  } catch (e) {
    next(e);
  }
}

// Creates a pending order for a plan; the client then calls
// POST /payment/:orderId (the normal EPS flow) to pay for it.
async function createSubscriptionOrder(req, res, next) {
  try {
    const plan = await Plan.findById(req.params.planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ message: "প্ল্যানটি পাওয়া যায়নি" });
    }
    const order = await Order.create({
      user: req.user.id,
      items: [],
      totalAmount: plan.price,
      finalAmount: plan.price,
      subscriptionPlan: plan._id,
      paymentMethod: "eps",
      paymentStatus: "pending",
      orderStatus: "pending",
      fromCart: false,
    });
    res.status(201).json({ message: "Order created successfully", order });
  } catch (e) {
    next(e);
  }
}

// Called from markOrderPaid for subscription orders. Buying while already
// subscribed extends the current period.
async function activateFromOrder(order) {
  const plan = await Plan.findById(order.subscriptionPlan);
  if (!plan) return null;
  const existing = await activeSubscription(order.user);
  const start = existing ? existing.expiresAt : new Date();
  const sub = await Subscription.create({
    user: order.user,
    plan: plan._id,
    planName: plan.name,
    startsAt: new Date(),
    expiresAt: new Date(start.getTime() + plan.durationDays * DAY),
    source: "purchase",
    order: order._id,
  });
  await notifyUser(order.user, {
    type: "payment",
    title: "সাবস্ক্রিপশন চালু হয়েছে",
    message: `${plan.name} প্ল্যান চালু হয়েছে। এখন সব বই পড়তে পারবেন।`,
    link: "/library",
  });
  return sub;
}

/* ---------- admin: plans ---------- */

async function adminListPlans(req, res, next) {
  try {
    const plans = await Plan.find().sort({ order: 1, price: 1 });
    const now = new Date();
    const out = await Promise.all(
      plans.map(async (p) => ({
        ...p.toObject(),
        activeSubscribers: await Subscription.countDocuments({
          plan: p._id,
          status: "active",
          expiresAt: { $gt: now },
        }),
      })),
    );
    res.json({ data: out });
  } catch (e) {
    next(e);
  }
}

function planFields(body) {
  const out = {};
  ["name", "description", "price", "durationDays", "isActive", "order"].forEach((f) => {
    if (body[f] !== undefined) out[f] = body[f];
  });
  return out;
}

async function createPlan(req, res, next) {
  try {
    const plan = await Plan.create(planFields(req.body));
    res.status(201).json({ data: plan });
  } catch (e) {
    next(e);
  }
}

async function updatePlan(req, res, next) {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, planFields(req.body), {
      new: true,
      runValidators: true,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ data: plan });
  } catch (e) {
    next(e);
  }
}

async function deletePlan(req, res, next) {
  try {
    const used = await Subscription.countDocuments({
      plan: req.params.id,
      status: "active",
      expiresAt: { $gt: new Date() },
    });
    if (used > 0) {
      return res.status(400).json({
        message: `${used} জন সক্রিয় সাবস্ক্রাইবার আছে। প্ল্যানটি ডিলিট না করে নিষ্ক্রিয় করুন।`,
      });
    }
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted" });
  } catch (e) {
    next(e);
  }
}

/* ---------- admin: subscriptions ---------- */

async function adminListSubscriptions(req, res, next) {
  try {
    const subs = await Subscription.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ data: subs });
  } catch (e) {
    next(e);
  }
}

async function adminGrantSubscription(req, res, next) {
  try {
    const { userId, planId, days } = req.body;
    const [user, plan] = await Promise.all([User.findById(userId), Plan.findById(planId)]);
    if (!user || !plan) return res.status(404).json({ message: "ইউজার বা প্ল্যান পাওয়া যায়নি" });
    const length = Number(days) > 0 ? Number(days) : plan.durationDays;
    const sub = await Subscription.create({
      user: user._id,
      plan: plan._id,
      planName: plan.name,
      expiresAt: new Date(Date.now() + length * DAY),
      source: "admin",
    });
    await notifyUser(user._id, {
      type: "announcement",
      title: "সাবস্ক্রিপশন চালু হয়েছে",
      message: `${plan.name} প্ল্যান ${length} দিনের জন্য চালু করা হয়েছে।`,
      link: "/library",
    });
    res.status(201).json({ data: sub });
  } catch (e) {
    next(e);
  }
}

async function adminRevokeSubscription(req, res, next) {
  try {
    const sub = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: "revoked" },
      { new: true },
    );
    if (!sub) return res.status(404).json({ message: "Subscription not found" });
    res.json({ data: sub });
  } catch (e) {
    next(e);
  }
}

async function adminExtendSubscription(req, res, next) {
  try {
    const days = Number(req.body.days);
    if (!(days > 0)) return res.status(400).json({ message: "দিন সংখ্যা দিন" });
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: "Subscription not found" });
    const base = sub.expiresAt > new Date() ? sub.expiresAt : new Date();
    sub.expiresAt = new Date(base.getTime() + days * DAY);
    sub.status = "active";
    await sub.save();
    res.json({ data: sub });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  listPlans,
  mySubscription,
  createSubscriptionOrder,
  activateFromOrder,
  adminListPlans,
  createPlan,
  updatePlan,
  deletePlan,
  adminListSubscriptions,
  adminGrantSubscription,
  adminRevokeSubscription,
  adminExtendSubscription,
};
