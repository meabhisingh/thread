const User = require("../models/user-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const formidable = require("formidable");
const cloudinary = require("../config/cloudinary");

exports.signin = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ msg: "userName , email and password are required !" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ msg: "User is already registerd ! Please Login ." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(400).json({ msg: "Error in password hashing !" });
    }
    const user = new User({
      userName,
      email,
      password: hashedPassword,
    });
    const result = await user.save();
    if (!result) {
      return res.status(400).json({ msg: "Error while saving user !" });
    }
    const accesToken = jwt.sign({ token: result._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    if (!accesToken) {
      return res.status(400).json({ msg: "Error while generating token !" });
    }
    res.cookie("token", accesToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
    res
      .status(201)
      .json({ msg: `User Signed in successfully ! hello ${result?.userName}` });
  } catch (err) {
    res.status(400).json({ msg: "Error in signin !", err: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password are required !" });
    }
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({ msg: "Please Signin first !" });
    }
    console.log(userExists);
    const passwordMatched = await bcrypt.compare(password, userExists.password);
    if (!passwordMatched) {
      return res.status(400).json({ msg: "Incorrect credentials !" });
    }
    const accessToken = jwt.sign(
      { token: userExists._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    if (!accessToken) {
      return res.status(400).json({ msg: "Token not gemnerated in login !" });
    }
    res.cookie("token", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      partitioned: true,
    });
    res.status(200).json({ msg: "User logged in succcessfully !" });
  } catch (err) {
    res.status(400).json({ msg: "Error in login !", err: err.message });
  }
};

exports.userDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "id is required !" });
    }
    const user = await User.findById(id)
      .select("-password")
      .populate("followers")
      .populate({
        path: "threads",
        populate: [{ path: "likes" }, { path: "comments" }, { path: "admin" }],
      })
      .populate({ path: "replies", populate: { path: "admin" } })
      .populate({
        path: "reposts",
        populate: [{ path: "likes" }, { path: "comments" }, { path: "admin" }],
      });
    res.status(200).json({ msg: "User Details Fetched !", user });
  } catch (err) {
    res.status(400).json({ msg: "Error in userDetails !", err: err.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Id is required !" });
    }
    const userExists = await User.findById(id);
    if (!userExists) {
      return res.status(400).json({ msg: "User don`t Exist !" });
    }
    if (userExists.followers.includes(req.user._id)) {
      await User.findByIdAndUpdate(
        userExists._id,
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      );
      return res.status(201).json({ msg: `Unfollowed ${userExists.userName}` });
    }
    await User.findByIdAndUpdate(
      userExists._id,
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    );
    return res.status(201).json({ msg: `Following ${userExists.userName}` });
  } catch (err) {
    res.status(400).json({ msg: "Error in followUser !", err: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userExists = await User.findById(req.user._id);
    if (!userExists) {
      return res.status(400).json({ msg: "No such user !" });
    }
    const form = formidable({});
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ msg: "Error in formidable !", err: err });
      }
      if (fields.text) {
        await User.findByIdAndUpdate(
          req.user._id,
          { bio: fields.text },
          { new: true }
        );
      }
      if (files.media) {
        if (userExists.public_id) {
          await cloudinary.uploader.destroy(
            userExists.public_id,
            (error, result) => {
              console.log({ error, result });
            }
          );
        }
        const uploadedImage = await cloudinary.uploader.upload(
          files.media.filepath,
          { folder: "Threads_clone_youtube/Profiles" }
        );
        if (!uploadedImage) {
          return res.status(400).json({ msg: "Error while uploading pic !" });
        }
        await User.findByIdAndUpdate(
          req.user._id,
          {
            profilePic: uploadedImage.secure_url,
            public_id: uploadedImage.public_id,
          },
          { new: true }
        );
      }
    });
    res.status(201).json({ msg: "Profile updated successfully !" });
  } catch (err) {
    res.status(400).json({ msg: "Error in updateProfile !", err: err.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { query } = req.params;
    const users = await User.find({
      $or: [
        { userName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json({ msg: "Searched !", users });
  } catch (err) {
    res.status(400).json({ msg: "Error in searchUser !", err: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      partitioned: true,
    });

    res.status(201).json({ msg: "You logged out !" });
  } catch (err) {
    res.status(400).json({ msg: "Error in logout" });
  }
};

exports.myInfo = async (req, res) => {
  try {
    res.status(200).json({ me: req.user });
  } catch (err) {
    res.status(400).json({ msg: "Error in myInfo !" });
  }
};
