const adminModel = require("../Model/adminModel");
const { Validator } = require("node-input-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.RegisterAdmin = async (req, res) => {
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
  await adminModel
    .findOne({ email: req.body.email })
    .then(async (data) => {
      if (data == null) {
        const admindata = {
          ...req.body,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        };
        await adminModel(admindata)
          .save()
          .then((data) => {
            console.log(data);
            return res.status(200).json({
              status: true,
              msg: "admin register succesfully",
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
    const admin = await adminModel
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
       res.status(202).send({status:true, msg:"admin login succesfully",data:token})
      }
    });
  } catch (error) {
    res.status(404).send({status:false, msg:"data not found"})
  }
  next();   
};

