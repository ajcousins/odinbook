const express = require("express");

const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/current")
  .get(authController.protect, userController.currentUser);

router.get("/whoToFollow", authController.protect, userController.whoToFollow);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route("/follow").post(authController.protect, userController.followUser);

router
  .route("/unfollow")
  .post(authController.protect, userController.unfollowUser);

router
  .route("/:id/followers")
  .get(authController.protect, userController.followersList);

router
  .route("/:id/following")
  .get(authController.protect, userController.followingList);

router.route("/updateUser").post(
  authController.protect,
  // userController.uploadUserPhoto,
  // userController.resizeUserPhoto,
  userController.updateUser
);

router.route("/redundantPhotos").post(userController.redundantPhotos);

module.exports = router;
