const express = require('express')
const auth = require('../../middlewares/auth')
const validate = require('../../middlewares/validate')
const userValidation = require('../../validations/user.validation')
const userController = require('../../controllers/user.controller')

const router = express.Router()

router
   .route('/')
   .get(auth('getUsers'), userController.getUsers)
   .post(auth('manageUsers'), validate(userValidation.createUser), userController.createUser)
   .patch(auth(), userController.updateUser)


router
   .route('/:userId')
   .patch(auth(), userController.updateUser)

router.route('/profile/:id').patch(auth(), userController.updateUserProfile)

module.exports = router
