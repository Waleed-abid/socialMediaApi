const router = require("express")();
const Post = require("../models/Post");
const User = require("../models/user");

//create a post
router.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user) {
      const newPost = await Post.create(req.body);
      return res.status(200).send(newPost);
    }
    res.status(200).send("User does not exist");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
// update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("No post found");
    if (post.userId === req.body.userId) {
      await Post.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      return res.status(200).send("Post updated successfully");
    } else {
      return res.status(403).send("you can only update your own post");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(200).json("No Post Found");
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(200).send("Post deleted successfully");
    } else {
      return res.status(403).send("you can only delete your own post");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post Not found");
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).send("Post has been liked");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//dislike a post
router.put("/:id/dislike", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post Not found");
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      return res.status(200).send("Post has been disliked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).send("Post has been disliked");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("Post Not Found");
    res.status(200).send(post);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//get timeline posts
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
