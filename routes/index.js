const Router = require('express')
const router = new Router()
const locationRouter = require('./locationRouter')
const employmentTypeRouter = require('./employmentTypeRouter')
const userRouter = require('./userRouter')
const vacancyRouter = require('./vacancyRouter')
const listRouter = require('./listRouter')

router.use('/user', userRouter)
router.use('/type', employmentTypeRouter)
router.use('/location', locationRouter)
router.use('/vacancy', vacancyRouter)
router.use('/list', listRouter)


module.exports = router