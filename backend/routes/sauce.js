const express = require('express');
const router = express.Router();
const multer = require('../middleware/multerconfig');
const auth = require("../middleware/auth");
const sauceController = require('../controller/sauce')


router.get("/", auth, sauceController.getAllSauce)
router.post("/", auth, multer, sauceController.createSauce)
router.get("/:id", auth, sauceController.getOneSauce)
router.put("/id", auth, multer, sauceController.modifySauce)
router.delete("/:id", auth, sauceController.deleteSauce)
router.post("/:id/like", sauceController.userLikeDislike)


module.exports = router;