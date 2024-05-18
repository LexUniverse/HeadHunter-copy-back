const Router = require('express')
const router = new Router()
const listController = require('../controllers/ListController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', listController.add)
router.get('/', listController.getAll)
router.delete('/', listController.delete)


module.exports = router