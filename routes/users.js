const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        return res
          .status(200)
          .send({ message: "Your Account has been updated", data: user });
      } catch (error) {
        return res.status(500).send(error.message);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res
        .status(200)
        .send({ message: "Account updated sucessfully", data: user });
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    return res
      .status(403)
      .send({ meesage: "You can only update your own account" });
  }
});

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).send("No Account found");
      return res.status(200).send({ message: "Account deleted sucessfully" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    return res
      .status(403)
      .send({ meesage: "You can only delete your own account" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err.message);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      if (user.followers.includes(req.body.userId)) {
        //user to follow
        await User.findByIdAndUpdate(req.params.id, {
          $pull: { followers: req.body.userId },
        });
        //current user logged in
        await User.findByIdAndUpdate(req.body.userId, {
          $pull: { following: req.params.id },
        });
        return res.status(200).send("User has been unfollowed");
      } else {
        return res.status(403).send("You already unfollowed this user");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  } else {
    res.status(403).send("You cant unfollow yourself");
  }
});

module.exports = router;
