const express = require("express");

const {
  getDashboard,
  getMonthlySales,
  getTopBooks,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
} = require("../controllers/adminController");

const cat = require("../controllers/categoryController");
const author = require("../controllers/authorController");
const sub = require("../controllers/subscriptionController");
const content = require("../controllers/userContentController");
const { broadcast } = require("../controllers/notificationController");
const { checkLogin, requireRole } = require("../middlewares/common/checkLogin");

const { avatarUpload } = require("../middlewares/users/avatarUpload");

const router = express.Router();

router.use(checkLogin, requireRole("admin"));

router.post("/notifications", broadcast);

// Categories
router.get("/categories", cat.listCategories);
router.post("/categories", cat.createCategory);
router.put("/categories/reorder", cat.reorderCategories);
router.put("/categories/:id", cat.updateCategory);
router.delete("/categories/:id", cat.deleteCategory);

// Author profile (single author)
router.get("/author", author.getAuthor);
router.put("/author", author.saveAuthor);

// Subscription plans & subscriptions
router.get("/plans", sub.adminListPlans);
router.post("/plans", sub.createPlan);
router.put("/plans/:id", sub.updatePlan);
router.delete("/plans/:id", sub.deletePlan);
router.get("/subscriptions", sub.adminListSubscriptions);
router.post("/subscriptions", sub.adminGrantSubscription);
router.patch("/subscriptions/:id/revoke", sub.adminRevokeSubscription);
router.patch("/subscriptions/:id/extend", sub.adminExtendSubscription);

// A user's content (library) management
router.get("/users/:id/content", content.getUserContent);
router.delete("/users/:id/content/:bookId", content.revokeBook);
router.post("/users/:id/content/:bookId", content.grantBook);
router.get("/dashboard", getDashboard);
router.get("/sales", getMonthlySales);
router.get("/top-books", getTopBooks);

// User Management
router.get("/users", getUsers);
router.get("/users/:id", getUser);

router.post(
  "/users",
  checkLogin,
  requireRole("admin"),
  avatarUpload,
  createUser,
);

router.put("/users/:id", avatarUpload, updateUser);

router.delete("/users/:id", deleteUser);

module.exports = router;
