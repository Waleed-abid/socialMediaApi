const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).send(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).send({ message: "user not found" });
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).send({ message: "Wrong Password" });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
