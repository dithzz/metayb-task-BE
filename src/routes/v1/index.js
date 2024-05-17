const express = require('express')
const authRoute = require('./auth.route')
const userRoute = require('./user.route')
const jobRoute = require('./job.route')

const router = express.Router()

const defaultRoutes = [
   {
      path: '/auth',
      route: authRoute,
   },
   {
      path: '/users',
      route: userRoute,
   },
   {
      path: '/jobs',
      route: jobRoute,
   },
]


defaultRoutes.forEach((route) => {
   router.use(route.path, route.route)
})



module.exports = router
