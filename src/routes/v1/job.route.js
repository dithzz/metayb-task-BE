const express = require('express')
const auth = require('../../middlewares/auth')
const jobController = require('../../controllers/job.controller')
const validate = require('../../middlewares/validate')
const { jobValidation } = require('../../validations')

const router = express.Router()

router
   .route('/')
   .get(auth(), jobController.getJobs)
   .post(auth(), validate(jobValidation.addJob), jobController.createJob)

router
   .route('/:jobId')
   .get(auth(), jobController.getJob)


module.exports = router
