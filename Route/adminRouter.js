const router = require("express").Router()
const adminController = require("../Controller/adminController")


router.post("/register",adminController.RegisterAdmin);
router.post("/login",adminController.login)

module.exports = router;