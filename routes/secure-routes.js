const express = require('express');
const router = express.Router();
const authController = require('../controller/authController')

router.get(
  '/', authController.protect,
  (req, res, next) => {
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
    })
  }
);

module.exports = router;