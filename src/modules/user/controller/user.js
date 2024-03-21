import userModel from "../../../../DB/model/User.model.js";
import { apiFeatures } from "../../../utils/ApiFeatures.js";
import { generateToken}from "../../../utils/GenerateAndVerifyToken.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
import sendEmail from "../../../utils/email.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url";




const __dirname = fileURLToPath(import.meta.url);

export const getUsers = asyncHandler(async (req, res, next) => {
  
  const userId = req.user;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("No User found with this Id!", { cause: 400 }));
  }
  const User = user.userName;
  const apiFeature = new apiFeatures(userModel.find(),req.query).search().sort().filter().fields().paginate()
  const users =await apiFeature.mongooseQuery;
  res.status(200).json({ message: `Welcome ${User}`, data:users,success:true });
});

export const userProfile = asyncHandler(async (req, res, next) => {
    const userId = req.user;
    const user = await userModel.findById(userId);
    res.status(200).json({ message: "User deleted successfully!", data:user,success:true });
  });

export const addUsers = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email,gender, password, role } = req.body;

  if (await userModel.findOne({ email })) {
    return next(
      new Error("exist user ,please use another email or login", { code: 409 })
    );
  }
  const token = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 5,
  });
  const refreshToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_TOKEN,
    expiresIn: 60 * 60 * 24,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const rfLink = `${req.protocol}://${req.headers.host}/auth/NewConfirmEmail/${refreshToken}`;
  const html = `<!DOCTYPE html>
                <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <h1>
                    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="${process.env.logo}">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
                </td>
                </tr>
                <tr>
                <td>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <br>
                <a href="${rfLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">request new emailConfirmation</a>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
                <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
                <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
                </a>

                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
                </html>`;
  if (!(await sendEmail({ to: email, subject: "confirmation email", html }))) {
    return next(new Error("email rejected", { cause: 409 }));
  }
  const hashPassword = hash({ plaintext: password });
  const user = await userModel.create({
    userName: firstName + lastName,
    email,
    gender,
    password: hashPassword,
    role,
  });
  res.status(200).json({ userId: user, message: "User created successfully!",success:true });
});

export const addUserImage = asyncHandler(async (req, res, next) => {
  const userId = req.user
  const profileImage = req.file;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("No User found with this Id!", { cause: 400 }));
  }
  if (user.image) {
    const oldImagePath = path.join(
      __dirname,'..','..','..','..'
      ,`${user.urlToUpdate}`
    );
    const imageurl =user.image
    const words = imageurl.split(' ');
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
  const fullPath = profileImage.finalDest;
  await userModel.findByIdAndUpdate(userId,
    {
      urlToUpdate: fullPath,
      image: fullPath,
    }
  );
  res
    .status(200)
    .json({ userId: user._id, message: "User image updated successfully!",success:true });
});

export const updateUsers = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, gender, role, status } =
    req.body;
  const userId = req.params._id;
  const hashPassword = hash({ plaintext: password });

  await userModel.findByIdAndUpdate(userId, {
    userName: firstName + lastName,
    email,
    password: hashPassword,
    gender,
    role,
    status,
  });
  res.status(200).json({ message: "User updated successfully!",success:true });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, cPassword } = req.body;
  const userId = req.user;
  const oldUser = await userModel.findById(userId);
  if (!compare({ plaintext: oldPassword, hashValue: oldUser.password })) {
    return next(new Error(`old password doesn't match`, { cause: 400 }));
  }
  if (newPassword !== cPassword) {
    return next(
      new Error("New Password and Confirm Password do not match", {
        cause: 400,
      })
    );
  }
  const hashPassword = hash({ plaintext: newPassword });
  const user = await userModel.updateOne(
    { userId },
    {
      password: hashPassword,
      status: "offline",
    }
  );
  res
    .status(200)
    .json({ message: "password changed successfully! please login again" ,success:true});
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("No User found with this Id!", { cause: 400 }));
  }
  if (user.image) {
    const oldImagePath = path.join(
      __dirname,'..','..','..','..'
      ,`${user.urlToUpdate}`
    );
    const imageurl =user.image
    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  }
 await userModel.findByIdAndDelete( userId);
  res.status(200).json({ message: "User deleted successfully!",success:true });
});
