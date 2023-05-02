const userModel = require("../Model/userModel");
const { Validator } = require("node-input-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.RegisterUser = async (req, res) => {
  let rules = {
    name: "required",
    email: "required|email",
    phone: "required",
    password: "required",
  };

  let v = new Validator(req.body, rules);
  let matched = await v.check().then((val) => val);

  if (!matched) {
    return res.status(404).send({
      status: false,
      error: v.error,
      //msg: InputError(v.error),
    });
  }
  await userModel
    .findOne({ email: req.body.email })
    .then(async (data) => {
      if (data == null) {
        const userdata = {
          ...req.body,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        };
        await userModel(userdata)
          .save()
          .then((data) => {
            console.log(data);
            return res.status(200).json({
              status: true,
              msg: "user register succesfully",
              data: data,
            });
          });
      } else {
        return res.status(403).json({
          status: false,
          msg: "email already exists",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(505).json({
        status: false,
        msg: "server error",
        err: err,
      });
    });
};

exports.login = async (req, res, next) => {
  try {
    const user = await userModel
    .findOne({ email: req.body.email })
    .then((result) => {
      if (bcrypt.compareSync(req.body.password, result.password)) {
        const token = jwt.sign(
          {
            id: result._id,
            email: result.adminEmail,
          },
          "Rahul-19956@admin",
          { expiresIn: "5h" }
        );
       res.status(202).send({status:true, msg:"login succesfully"})
      }
    });
  } catch (error) {
    res.status(404).send({status:false, msg:"data not found"})
  }
  next();   
};

// const validator = require("validator");
// const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
// const userModel = require("../Model/model");

// exports.registerUser = async (req, res) => {
//   if (!validator.isEmail(req.body.email)) {
//     return res.status(400).json({ message: 'Invalid email address' });
//   }

//   if (validator.isEmpty(req.body.name)) {
//     return res.status(400).json({ message: 'Name field is required' });
//   }

//   if (!validator.matches(req.body.phone, /^\d{10}$/)) {
//     return res.status(400).json({ message: 'Invalid phone number' });
//   }

//   if (!validator.isLength(req.body.password, { min: 6 })) {
//     return res.status(400).json({ message: 'Password must be at least 6 characters long' });
//   }

//     const check1 = userModel
//     .aggregate([
//       {
//         $match: { status: false },
//       },
//       {
//         $project: {
//           _id: 1,
//         },
//       },
//     ])
//     .then((data) => {
//       console.log("userData", data);
//       if (data.length > 0) {
//         res.status(404).send({
//           status: false,
//           data: data,
//           msg: "User Already Exist",
//         });
//       } else {
//         userModel({
//           name: req.body.name,
//           email: req.body.email,
//           phone: req.body.phone,
//           password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
//         })
//           .save()
//           .then((data) => {
//             res
//               .status(202)
//               .send({
//                 status: true,
//                 msg: "User register succesfully",
//                 userDatat: data,
//               });
//           })
//           .catch((err) => {
//             res
//               .status(404)
//               .send({ status: false, msg: "somthing went wrong", err: err });
//           });
//       }
//     })
//     .catch((err) => {
//       res
//         .status(400)
//         .send({ status: false, msg: "somthing went wrong", err: err });
//     });
// };

