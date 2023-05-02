const Router = require("express").Router()
const Controller = require("../Controller/userController")

Router.post("/register",Controller.RegisterUser);
Router.post("/login",Controller.login)
module.exports = Router ;